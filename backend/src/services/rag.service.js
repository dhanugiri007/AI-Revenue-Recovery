const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { Document } = require("@langchain/core/documents");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { getVectorStore } = require("../config/vectorstore");
const Policy = require("../models/policy.model");

// Splits policy text into chunks and stores embeddings in Chroma
const embedPolicy = async (policy, companyId) => {
  try {
    policy.embeddingStatus = "processing";
    await policy.save();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 150,
    });

    const chunks = await splitter.splitText(policy.extractedText);

    const documents = chunks.map(
      (chunk, index) =>
        new Document({
          pageContent: chunk,
          metadata: {
            policyId: policy._id.toString(),
            originalName: policy.originalName,
            chunkIndex: index,
          },
        })
    );

    const vectorStore = await getVectorStore(companyId);
    await vectorStore.addDocuments(documents);

    policy.embeddingStatus = "completed";
    await policy.save();
  } catch (error) {
    console.error("Embedding failed:", error.message);
    policy.embeddingStatus = "failed";
    await policy.save();
  }
};

// Retrieves top-k relevant policy chunks for a given query
const retrievePolicyContext = async (companyId, query, k = 4) => {
  const vectorStore = await getVectorStore(companyId);
  const results = await vectorStore.similaritySearch(query, k);

  return results.map((doc) => ({
    content: doc.pageContent,
    policyId: doc.metadata.policyId,
    originalName: doc.metadata.originalName,
  }));
};

module.exports = { embedPolicy, retrievePolicyContext };
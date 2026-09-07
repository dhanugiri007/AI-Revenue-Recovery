const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { HuggingFaceInferenceEmbeddings } = require("@langchain/community/embeddings/hf");

const getEmbeddings = () => {
  return new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGINGFACEHUB_API_KEY,
    model: "sentence-transformers/all-MiniLM-L6-v2",
  });
};

const getVectorStore = async (companyId) => {
  const embeddings = getEmbeddings();

  try {
    return new Chroma(embeddings, {
      collectionName: `policies_${companyId}`,
      url: process.env.CHROMA_URL,
    });
  } catch (error) {
    console.error("RAW Chroma connection error:", error.message);
    console.error("CHROMA_URL being used:", process.env.CHROMA_URL);
    throw error;
  }
};

module.exports = { getVectorStore, getEmbeddings };
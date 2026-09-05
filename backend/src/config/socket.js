let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Client tells us which company's updates it wants to receive
    socket.on("join_company", (companyId) => {
      socket.join(`company_${companyId}`);
      console.log(`Socket ${socket.id} joined company_${companyId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

// Called from controllers to broadcast an event to everyone watching a company
const emitToCompany = (companyId, event, payload) => {
  if (!ioInstance) return;
  ioInstance.to(`company_${companyId}`).emit(event, payload);
};

module.exports = { initSocket, emitToCompany };
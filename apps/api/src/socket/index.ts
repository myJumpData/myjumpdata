import Live from "../models/live.model";

export default function Socket(io: any) {
  io.on("connection", (socket) => {
    console.log("+ " + socket.id);

    socket.on("GET:LIVE:COUNTER", (...params) => {
      const d = params[0];
      if (d.key) {
        Live.find({
          key: { $exists: true, $eq: d.key },
        }).exec((err, ddb) => {
          const data = ddb[0];
          if (!err && data) {
            socket.join("LIVE:" + data._id);
            socket.emit("LIVE:COUNTER", {
              count: data.count,
              id: data._id,
              key: d.key,
            });
          }
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("- " + socket.id);
    });
  });
  Live.watch().on("change", (change) => {
    if (change.updateDescription?.updatedFields.count !== undefined) {
      const docId = String(change.documentKey?._id);
      io.to("LIVE:" + docId).emit("LIVE:COUNTER", {
        id: docId,
        count: change.updateDescription?.updatedFields.count,
      });
    }
  });
}

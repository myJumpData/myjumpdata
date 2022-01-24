import { CONNECT_STRING_TEST } from "@myjumpdata/consts";
import mongoose from "mongoose";
import Role from "../models/role.model";
import ScoreDataType from "../models/scoreDataType.model";
import createServer from "../server";

beforeAll((done) => {
  mongoose.connect(CONNECT_STRING_TEST).then(() => {
    ["athlete", "coach"].forEach((role_item) => {
      const role = new Role({ name: role_item });
      role.save((err: any) => {
        if (err) {
          console.log(err);
        }
      });
    });
    [
      "30s Crosses",
      "30s Speed",
      "30s DU",
      "2m Speed",
      "3m Speed",
      "TU",
    ].forEach((type_item) => {
      const type = new ScoreDataType({ name: type_item });
      type.save((err: any) => {
        if (err) {
          console.log(err);
        }
      });
    });
    done();
  });
});

afterAll((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

const app = createServer();
export default app;

describe("Database", () => {
  it("should return connected", () => {
    expect(mongoose.connection.readyState).toEqual(1);
  });
});

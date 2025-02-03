import request from "supertest";
import express from "express";
import { cancelamentoRouter } from "../../infra/routes/cancelamento-router";

const app = express();
app.use(express.json());
app.use("/cancelamento", cancelamentoRouter);

describe("CancelamentoController", () => {
  it("deve solicitar o cancelamento de uma disciplina com sucesso", async () => {
    const response = await request(app)
      .post("/cancelamento")
      .send({
        alunoId: "123",
        disciplinaId: "456",
        motivo: "Mudança de curso"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("alunoId", "123");
  });

  it("deve retornar erro ao tentar cancelar sem todos os campos", async () => {
    const response = await request(app)
      .post("/cancelamento")
      .send({
        alunoId: "123",
        motivo: "Mudança de curso"
      });

    expect(response.status).toBe(400);
  });
});

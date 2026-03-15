import { Router } from "express"
import swaggerUi from "swagger-ui-express"

const router = Router()

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Knex Case Backend API",
    version: "1.0.0",
    description: "Documentação Swagger para o backend do case"
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      RegisterPayload: {
        type: "object",
        properties: {
          email: { type: "string" },
          password: { type: "string" },
          companyId: { type: "string" }
        },
        required: ["email", "password"]
      },
      LoginPayload: {
        type: "object",
        properties: {
          email: { type: "string" },
          password: { type: "string" }
        },
        required: ["email", "password"]
      },
      TokenResponse: {
        type: "object",
        properties: {
          token: { type: "string" }
        }
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string" },
          companyId: { type: "string" },
          createdAt: { type: "string", format: "date-time" }
        }
      }
      ,
      Company: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          products: {
            type: "array",
            items: { $ref: "#/components/schemas/Product" }
          }
        }
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          price: { type: "number", format: "float" },
          companyId: { type: "string" }
        }
      },
      CreateProductPayload: {
        type: "object",
        properties: {
          name: { type: "string" },
          price: { type: "number", format: "float" }
        },
        required: ["name", "price"]
      },
      UpdateProductPayload: {
        type: "object",
        properties: {
          name: { type: "string" },
          price: { type: "number", format: "float" }
        }
      },
      CreateCompanyPayload: {
        type: "object",
        properties: {
          name: { type: "string" }
        },
        required: ["name"]
      },
      OrderItemInput: {
        type: "object",
        properties: {
          productId: { type: "string" },
          quantity: { type: "integer", format: "int32" }
        },
        required: ["productId", "quantity"]
      },
      CreateOrderPayload: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItemInput" }
          }
        },
        required: ["items"]
      },
      OrderItem: {
        type: "object",
        properties: {
          id: { type: "string" },
          orderId: { type: "string" },
          productId: { type: "string" },
          quantity: { type: "integer" },
          price: { type: "number", format: "float" },
          product: { $ref: "#/components/schemas/Product" }
        }
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          total: { type: "number", format: "float" },
          createdAt: { type: "string", format: "date-time" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItem" }
          }
        }
      }
    }
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Registrar usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterPayload" }
            }
          }
        },
        responses: {
          "201": {
            description: "Usuário criado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    user: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            }
          },
          "400": { description: "Requisição inválida" },
          "409": { description: "Usuário já existe" }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login de usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginPayload" }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TokenResponse" }
              }
            }
          },
          "401": { description: "Não autorizado" }
        }
      }
    }
    ,
    "/companies/my-company": {
      post: {
        tags: ["Companies"],
        summary: "Criar empresa e associar ao usuário",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateCompanyPayload" } } }
        },
        responses: {
          "201": { description: "Empresa criada", content: { "application/json": { schema: { $ref: "#/components/schemas/Company" } } } },
          "400": { description: "Requisição inválida" },
          "401": { description: "Não autenticado" }
        }
      },
      put: {
        tags: ["Companies"],
        summary: "Atualizar empresa do usuário autenticado",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] } } } },
        responses: { "200": { description: "Empresa atualizada", content: { "application/json": { schema: { $ref: "#/components/schemas/Company" } } } }, "403": { description: "Sem acesso" } }
      }
    },
    "/companies": {
      get: {
        tags: ["Companies"],
        summary: "Obter empresa do usuário autenticado",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Company" } } } }, "403": { description: "Usuário não pertence a uma empresa" } }
      }
    },
    "/companies/{id}/products": {
      get: {
        tags: ["Companies"],
        summary: "Listar produtos de uma empresa",
        security: [{ bearerAuth: [] }],
        parameters: [ { name: "id", in: "path", required: true, schema: { type: "string" } } ],
        responses: { "200": { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Product" } } } } }, "404": { description: "Empresa não encontrada" } }
      }
    },
    "/products": {
      post: {
        tags: ["Products"],
        summary: "Criar produto (empresa do usuário)",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateProductPayload" } } } },
        responses: { "201": { description: "Produto criado", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } }, "403": { description: "Usuário não pertence a uma empresa" } }
      },
      get: {
        tags: ["Products"],
        summary: "Listar todos os produtos",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "OK", content: { "application/json": { schema: { type: "object", properties: { products: { type: "array", items: { $ref: "#/components/schemas/Product" } } } } } } } }
      }
    },
    "/products/{id}": {
      put: {
        tags: ["Products"],
        summary: "Atualizar produto (empresa do usuário)",
        security: [{ bearerAuth: [] }],
        parameters: [ { name: "id", in: "path", required: true, schema: { type: "string" } } ],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateProductPayload" } } } },
        responses: { "200": { description: "Produto atualizado", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } }, "403": { description: "Sem acesso" }, "404": { description: "Produto não encontrado" } }
      },
      delete: {
        tags: ["Products"],
        summary: "Deletar produto",
        security: [{ bearerAuth: [] }],
        parameters: [ { name: "id", in: "path", required: true, schema: { type: "string" } } ],
        responses: { "204": { description: "Produto deletado" }, "403": { description: "Sem acesso" }, "404": { description: "Produto não encontrado" } }
      }
    },
    "/orders": {
      post: {
        tags: ["Orders"],
        summary: "Criar pedido",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateOrderPayload" } } } },
        responses: { "201": { description: "Pedido criado", content: { "application/json": { schema: { $ref: "#/components/schemas/Order" } } } }, "400": { description: "Pedido inválido" } }
      }
    },
    "/orders/my": {
      get: {
        tags: ["Orders"],
        summary: "Listar pedidos do usuário autenticado",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Order" } } } } } }
      }
    },
    "/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Obter pedido por id",
        security: [{ bearerAuth: [] }],
        parameters: [ { name: "id", in: "path", required: true, schema: { type: "string" } } ],
        responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Order" } } } }, "403": { description: "Sem acesso" }, "404": { description: "Pedido não encontrado" } }
      }
    }
  }
}

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export { router as swaggerRouter }

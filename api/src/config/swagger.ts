import swaggerJSDoc from "swagger-jsdoc";

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My api",
      version: "1.0.0",
      description: "My API documentation"
    },
    servers: [{ url: "/api" }]
  },
  apis: ["./src/routes/**.ts"]
});

export default swaggerSpec;

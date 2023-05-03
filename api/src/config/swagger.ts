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
  // This path is relative to the current directory from which the Node.js ran
  apis: ["./docs/**.yml"]
});

export default swaggerSpec;

FROM node:18-alpine

WORKDIR /api
COPY ./dist /api/dist

EXPOSE 4500
CMD ["node", "dist/app.js"]

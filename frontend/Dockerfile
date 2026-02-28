FROM node:20-alpine

WORKDIR /app

# Create a group and a non-root user
RUN addgroup expenses_control && adduser -D -G expenses_control dev

# Copy dependency file first to leverage Docker layer caching
COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# Switch to non-root user for runtime
USER dev

EXPOSE 3000

CMD ["npm", "start"]

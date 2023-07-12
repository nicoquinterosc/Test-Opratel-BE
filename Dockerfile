FROM node:lts
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# generated prisma files
COPY prisma ./prisma/

# COPY ENV variable
COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json ./

COPY . .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
# Bundle app source
RUN npx prisma generate

# Run and expose the server on port 3000
EXPOSE 3000

RUN npm run build
CMD ["node", "build/index.js"]
#CMD [ "node", "app.js" ]

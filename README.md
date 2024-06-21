# TaskMaster API

[![CI for taskMaster Project](https://github.com/jkarenzi/task-master-be/actions/workflows/CI.yaml/badge.svg)](https://github.com/jkarenzi/task-master-be/actions/workflows/CI.yaml)

[![codecov](https://codecov.io/gh/jkarenzi/task-master-be/graph/badge.svg?token=U0Z9YSSFFH)](https://codecov.io/gh/jkarenzi/task-master-be)

## Overview

Welcome to TaskMaster API! This project provides the backend API for the TaskMastere application. It is a robust task manager that allows users to create, update, style and delete their tasks

## Documentation

Find the API documentation at https://localhost:3000/api-docs

## Installation

To get started with the TaskMaster API, follow these simple steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/jkarenzi/task-master-be.git
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```


## Testing

- Run tests

  ```bash
  npm run test
  ```

- Run tests with coverage

  ```bash
  npm run test:ci
  ```

## Docker  

- Run in docker container
   ```bash
   docker-compose -f docker-compose.yml up
   ```

- Stop the container
   ```bash
   docker-compose -f docker-compose.yml down
   ```   

- Run tests in docker container  

  ```bash
  docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from test
  ```

## Usage

Once the development server is running, you can interact with the API using HTTP requests.

## Authors

- [Manzi Karenzi](https://github.com/jkarenzi)

## About The Project

![live-demo-15s-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/b0a5d3ac-bfe2-4e5c-b4e4-716154deaa8c)

This is a project making use of AI to detect your hand gesture to identify if you are doing the correct sign language. The AI is self-trained using a CNN model. You coudl learn the alphabet in ASL Sign Language, test what you have learn with quizzes and compare your quiz result with friends. Please see the video (https://youtu.be/trs0H3QVKG0) for the live demo.

The project is deployed via AWS. You could visit the website (https://sign-language-monster.live/).

<!-- GETTING STARTED -->
## Getting Started
To get a local copy up and running follow these simple example steps.
1. Create a `.env` file in the api-sever folder
   
    ```dosini
    DB_USERNAME={{database username}}
    DB_PASSWORD={{database password}}
    DB_NAME={{database name}}
    ```
2. Install yarn packages
    ```sh
    yarn install 
    ```
3. Navigate to `sanic-server` folder to create virtual environment and install python libraries
   ```sh
   cd sanic-server
   python -m venv .pyenv
   source .pyenv/bin/activate
   pip install -r requirements.txt
   ```
5. Navigate to `api-server` folder to run knex migrate and knex seed to preapre sample database and data
   ```sh
   yarn knex migrate:latest
   yarn knex seed:run
   ```
   
4. Navigate to `api-server` folder to start nodejs server
   ```sh
   cd api-server
   yarn start
   ```
5. Navigate to `sanic-server` folder to start python server
   ```sh
   cd sanic-server
   source .pyenv/bin/activate
   python server.py
   ```
   
## Project Wireframe and ERD
* [🌱 Wireframe](https://www.figma.com/design/671ca3E7lMBJzeiaYuMLC9/Sign-Language-Project---2024.05?node-id=0-1&t=bm7hyiFPYAE5og9K-0)
* [📖 ERD](https://drawsql.app/teams/anna-37/diagrams/sign-language-games)

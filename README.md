 
# 🐦 Murmur - Twitter-like Web Application

This is a simple web application similar to Twitter, where users can post short messages called Murmurs, follow other users, and interact via likes.

## 🛠️ Tech Stack

**🚀 Frontend: React + TypeScript** 

**⚙️ Backend: NestJS + TypeScript**  

**🐳 Database: MySQL (via Docker)** 








## 🌟 Features


✅ **Core Features**
- Timeline showing murmurs from followed users (with pagination)

- Post new murmurs

- Like murmurs

- Delete own murmurs

- View own profile with murmur list, follow/follower count

- View other users' profiles with murmur list, follow/follower count



🗄 **Database**

Main tables:
- users
- murmurs
- follows
- likes



🖥 **Project Structure**

/src       -> React frontend  
/server    -> NestJS backend  
/db        -> MySQL with Docker setup  











## ⚡ Development Setup
**Prerequisites**

npm , yarn ,Docker & Docker Compose

```bash
1. Database Setup
cd db
docker compose build
docker compose up -d
```
```bash
2. Backend Setup
cd server
npm install
npm run start:dev
```


```bash
3. Frontend Setup
cd src
yarn install
yarn dev
```

## Future Enhancement

Contributions are always welcome!

Future inhancement : Adding authentication using JWT, Redux


## Feedback

If you have any feedback, please reach out to me at asiful35-2961@diu.edu.bd


## Screenshots

**It's the timeline where user can post their own murmurs and see others whom they follow.They can like the other peoples murmur and unlike also. Here pagination is also added with per page 10 murmurs.**

![App Screenshot](https://res.cloudinary.com/ddrvm4qt3/image/upload/v1750736652/WhatsApp_Image_2025-06-23_at_11.19.47_PM_mkki5m.jpg)

![App Screenshot](https://res.cloudinary.com/ddrvm4qt3/image/upload/v1750736660/WhatsApp_Image_2025-06-23_at_11.20.08_PM_hb1o5e.jpg)

**It's the profile section where the information and murmurs are present. User  can delete their own murmur. On the other users page they can only view, Can't delete and also can follow.**

![App Screenshot](https://res.cloudinary.com/ddrvm4qt3/image/upload/v1750736667/WhatsApp_Image_2025-06-23_at_11.20.38_PM_abxgil.jpg)

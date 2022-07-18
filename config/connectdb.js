const {Sequelize,DataTypes}=require('sequelize')

const sequelize= new Sequelize('demo','root','rootroot',{
    host:'localhost',
    dialect:'mysql',
    pool:{max:5,min:0,idle:10000}
});

sequelize.authenticate()
.then(()=>{
    console.log('Connected');
})
.catch((err)=>{
    console.log("Error:",err)
})

const db={}
db.Sequelize=Sequelize;
db.sequelize=sequelize;
db.user=require('../models/user')(sequelize,DataTypes)
db.sequelize.sync()
.then(()=>{
    console.log("yes re-sync")
})
module.exports=db
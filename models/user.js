// const {Sequelize,DataTypes}=require('sequelize')

module.exports=(sequelize,DataTypes)=>{
    return sequelize.define('myuser',{
        id:{
            autoIncrement:true,
            type:DataTypes.BIGINT.UNSIGNED,
            allowNull:false,
            primaryKey:true 
          },
        name:{
            type:DataTypes.STRING(255),
            allowNull:false,
            trim:true
        },
        email:{
            type:DataTypes.STRING(255),
            allowNull:false,
            trim:true
        },
        password:{
            type:DataTypes.STRING(255),
            allowNull:false,
            trim:true
        },
        tc:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            
        },
    },{
        sequelize,
        tableName:'myuser',
        timestamps:true,
        indexes: [
            {
              name: "PRIMARY",
              unique: true,
              using: "BTREE",
              fields: [
                { name: "id" },
              ]
            },
          ]
    }
    ) 
}
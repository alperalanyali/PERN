require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const app = express();
app.use(morgan('dev'))
app.use(bodyparser.urlencoded({extended:false}))
const  db = require('./db')

const port = process.env.PORT || 3000;

app.get('/api/v1/getRestaurants',(req,res)=>{
    db.querry('select * from Restaurant',(err,respo)=>{
        res.status(200).json(respo.rows)
        console.log(respo.rows);
    })
  
 
})
app.get('/api/v1/getRestaurants/:id', async (req,res)=>{
    const id = req.params.id
    try{
    
        const  result = await (await db.querry('select  * from Restaurant where Id  = $1',[id])).rows[0]
        console.log(result);
         if(result)
             res.json(result)
         else
             res.json(`There is no data for ${id}`)
    }catch(err){
        console.log(err);
    }
  
})
app.post('/api/v1/createRestaurant', async (req,res)=>{
  console.log(req.body);
  const {name,location,price_range} = req.body;
  const restaurant = {
      name:name,
      location:location,
      price_range:price_range
  }
try{
   const result = await db.querry('Insert  into Restaurant (name,location,price_range) values($1,$2,$3) returning *',[name,location,price_range])
   console.log(result.rows[0]);
    res.json({
        status:201,
        restaurant : result.rows[0]
    })
}catch(err){
    console.log(err);
}
  
})
app.put('/api/v1/restaurants/:id',async (req,res)=>{
    const id = req.params.id
    const {name,location,price_range} = req.body
    console.log(id,name,location,price_range);
    const result = await db.querry(`Update  Restaurant set name =$1,location=$2,price_range=$3 where Id = $4 returning *`,[name,location,price_range,id])
    res.status(200).json(
        {
            status:'success',
            restaurant:result.rows[0]        
        }
    )    
})
app.delete('/api/v1/deleteRestaurant/:id', async (req,res)=>{
    const id = req.params.id;
    const result = await db.querry('delete from Restaurant where Id = $1',[id]);
    res.status(204).json(
        {
            status:'success',            
        }
    )
})
app.listen(port,()=>{
    console.log(`Server is listening to ${port} port`);
})


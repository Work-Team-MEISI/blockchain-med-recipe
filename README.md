# blockchain-med-recipe
Repository for our pratical project of the TGS course unit.

The project consists in an application for integrating the medical recipes of patients into a blockchain.

## Structure

There are two main components in this project which are an **rest API** for interacting with the blockchain and the **blockchain application** itself.

### API
The API must be authenticated based for validating each medical entity in cause which are **doctors** and **nurses**.

The **authenticated based API** will validate **doctors for registering the medical recipes** and **nurses for retrieving the recipe** for each patient. 

We must consider the following sample example structure of the information to consider:

```javascript
{
   "recipe_id":"1",
   "doctor_id":"3",
   "patient_number":"12",
   "recipe_info":[
      {
         "med_id":345,
         "description":"Paracetamol",
         "quantity":"1/2 pill",
         "duration":"3 days"
      },
      {
         "med_id":56,
         "description":"Benuron",
         "quantity":"1 spoon",
         "duration":"3 days"
      }
   ]
}
```

###  To be continued...

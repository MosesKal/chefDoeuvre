// route.get("/users", authentication, GetUsers);

// route.get("/users/:id", async (req, res, next) => {
//   const userId = req.params.id;

//   const user = await db.User.findByPk(userId);

//   if (user === null) {
//     res.status(500);
//   } else {
//     res.send(user);
//   }
// });

// route.patch("/users/:id", async (req, res, next) => {
//   const userId = req.params.id;

//   await db.User.update(req.body, {
//     where: {
//       id: userId,
//     },
//   });
//   res.send("Updated!");
// });

// route.delete("/users/:id", async (req, res, next) => {
//   const userId = req.params.id;

//   await db.User.destroy({
//     where: {
//       id: userId,
//     },
//   });
//   res.send("Deleted!");
// });

// const GetUsers = async (req, res, next) => {
//     try {
//       const users = await db.User.findAll({});
//       res.send(users);
//     } catch (e) {
//       res.status(500).send(e);
//     }
//   };
  
//   const GetUserById = async(req, res, next) =>{
//   }
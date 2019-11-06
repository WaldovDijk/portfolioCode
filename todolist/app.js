app.post("/add", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const addItem = new Item ({
    name: itemName
  });

  if(listName === "Today")
  {
    addItem.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function (err, foundList) {
      foundList.items.push(addItem);
      foundList.save();
      res.redirect("/" + listName);
    });

  }
});

app.post("/delete", function(req, res){

  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today")
  {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (err){
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      {name: listName},
      {$pull: {items: {_id: checkedItemId}}},
      function(err, foundList){
        if(!err)
        {
          res.redirect("/" + listName);
        }
    })
  }


});

app.get("/:Listname", function(req,res){
  const listName = _.capitalize(req.params.Listname);

  List.findOne({name: listName}, function(err, foundList){
    if(!err){
      if(!foundList){
        const list = new List ({
          name: listName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + listName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }
  })
});

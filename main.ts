
// we have a item class for our crafting stuffs
class Item {
  price: number;
  name: string;
  recipe?: Item[];

  id : number = 0;

  static all_items: Item[] = [];
  static amount_of_items:number = 0;

  constructor(price: number, name: string, recipe?: Item[]) {
    this.price = price;
    this.name = name;
    this.recipe = recipe;
    Item.all_items.push(this); //  we need to add to all_items for shop keeping
    this.id = Item.amount_of_items;
    Item.amount_of_items += 1;
  }
}

// define some items
const paper = new Item(1, "Paper");
const paper_crane = new Item(5, "Paper Crane", [paper,paper]);
const wood = new Item(5, "Wood");
const iron = new Item(8, "Iron");
const copper_wire = new Item(8, "Copper Wire");
const electromagnet = new Item(22, "Electromagnet",[iron,copper_wire]);
const door = new Item(25, "Door",[wood,wood,iron]);
const electric_motor = new Item(65, "Electric Motor",[electromagnet,electromagnet,copper_wire]);
const electric_bike = new Item(100, "Electric Bike",[electric_motor,copper_wire,iron]);
const go_kart = new Item(110, "Electric Go Kart",[electric_motor,door,door,copper_wire]);
const dog_house = new Item(60, "Dog House",[door,wood]);



let money : number = 10;
let inventory : Item[] = [];

function get_item_from_drop_down(): Item | null {
  const shop_drop_down = document.getElementById("shop_drop_down") as HTMLSelectElement;
  if (shop_drop_down.options) {
    const selected = shop_drop_down.options[ shop_drop_down.selectedIndex ].value;
    const selected_item = Item.all_items[Number(selected)];
    return selected_item;
  }
  return null;
}

function first_time_display_text_update():void{
  //get the drop down. clear it. then we loop thru all items so we can update the drop down
  const shop_drop_down = document.getElementById("shop_drop_down") as HTMLSelectElement;
    shop_drop_down.innerHTML = "";

  for (var item of Item.all_items) {
    // we have to create a new option and update them all
    const newOption = document.createElement("option") as HTMLOptionElement;
    newOption.text = item.name + " $"+String(item.price);
    newOption.value = String(item.id);
    shop_drop_down.appendChild(newOption);
  }
  shop_drop_down.selectedIndex = 0;
}

function update_display_text():void {
  // first update money amount
  const money_lable = document.getElementById("money_lable") as HTMLElement;
  money_lable.textContent = "$"+String(money);
  // then update inventory
  const inventory_lable = document.getElementById("inventory_lable") as HTMLElement;
  if (inventory) {
    inventory_lable.textContent = inventory.map(item => item.name).join(", ");
  } else {
    inventory_lable.textContent = "You have no items...";
  }
  // now lets make the crafting recipes work
  const selected_item = get_item_from_drop_down();
  const craft_lable = document.getElementById("craft_lable") as HTMLElement;
  //check if item is selected
  if (selected_item !== null) {
    // now check if item has recipe
     if (selected_item.recipe !== undefined) {
       craft_lable.textContent="Found a recipe. It is -> "+selected_item.recipe.map(item => item.name).join(" + ");
     } else {
       craft_lable.textContent="This item has no recipe.";
     }
  } else {
    craft_lable.textContent="To select a item click the drop down menu.";
  }
}
function buy():void{
  // this is the simple function for buying items
  const selected_item = get_item_from_drop_down()
  if (selected_item !==null) {
    if (money >= selected_item.price) {
      money -= selected_item.price;
      inventory.push(selected_item);
    }
    update_display_text();
  }
}
function sell():void{
  // this is the simple function for selling items
  const selected_item = get_item_from_drop_down();
  if (selected_item !==null) {
    if (inventory.includes(selected_item)) {
      inventory.splice(inventory.indexOf(selected_item), 1);
      money += selected_item.price;
    }
    update_display_text();
  }
}
function craft():void {
  const selected_item = get_item_from_drop_down();
  if (selected_item !== null) {
    if (selected_item.recipe !== undefined) {
      //now we do a fancy thing i made to check if we have the ingredients
      let have_items_check = true;
      let dummy_inventory : Item[] = inventory.slice();// get copy
      for (var ingredient of selected_item.recipe) {
        if (!dummy_inventory.includes(ingredient)) {// if the item is not found in the
          have_items_check=false;
          break;//we exit the loop i
        } else {
          dummy_inventory.splice(dummy_inventory.indexOf(ingredient), 1);
        }
      }
      // now we have have_items_check that can be used to continue if
      // we have the all_items
      if (have_items_check) {
        //becuase the the dummy_inventory will just be the inventory with the
        //ingredients removed at this point we can just set the dummy_inventory
        //to the real inventory
        inventory=dummy_inventory;
        //then add the item we have crafted
        inventory.push(selected_item);
      }
    }
  }
  update_display_text();
}

// here we bind all out buttons to our functions
const buy_button = document.getElementById('buy_button') as HTMLButtonElement
buy_button?.addEventListener('click', buy);
const sell_button = document.getElementById('sell_button') as HTMLButtonElement
sell_button?.addEventListener('click', sell);
const craft_button = document.getElementById('craft_button') as HTMLButtonElement
craft_button?.addEventListener('click', craft);
const shop_drop_down = document.getElementById('shop_drop_down') as HTMLButtonElement
shop_drop_down?.addEventListener('click', update_display_text);

first_time_display_text_update();
update_display_text();

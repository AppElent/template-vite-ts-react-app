import * as fs from 'fs';
import data from './data-ficsmas.json' with { type: 'json' };
import simple from './simple.json' with { type: 'json' };
import ratings from './tierList.json' with { type: 'json' };

const isEquipment = (item) => item.className.startsWith('BP_Equipment');
const isRadioactive = (item) => item.radioactiveDecay > 0;
const isFuel = (item) => item.energyValue > 0;
const getTier = (item) => {
  const searchKey = item.liquid ? 'fluids' : 'items';
  const foundSimpleItem = simple[searchKey].find((i) => i.name === item.name);
  return foundSimpleItem ? foundSimpleItem.tier : 999;
};
const getRating = (recipe) => {
  const foundRating = ratings.find((r) => r.name === recipe.name);
  return foundRating;
};

// products
const items = Object.keys(data.items).map((key) => {
  const item = data.items[key];
  return {
    className: item.className,
    name: item.name,
    slug: item.slug,
    description: item.description,
    sinkPoints: item.sinkPoints,
    stackSize: item.stackSize,
    energyValue: item.energyValue,
    liquid: item.liquid,
    tier: getTier(item),
    isEquipment: isEquipment(item),
    isRadioactive: isRadioactive(item),
    isFuel: isFuel(item),
    isResource: Object.keys(data.resources).includes(item.className),
  };
});

// Show 5 random items from items
//console.log(items.sort(() => Math.random() - 0.5).slice(0, 5));

const recipes = Object.keys(data.recipes)
  .filter((key) => !data.recipes[key].forBuilding)
  .filter((key) => data.recipes[key].inMachine)
  .map((key) => {
    const recipe = data.recipes[key];
    if (recipe.producedIn.length !== 1) {
      console.log(recipe, recipe.producedIn.length, recipe.producedIn[0]);
    }
    return {
      ...recipe,
      producedIn: recipe.producedIn[0], //recipe.producedIn.length === 0 ? undefined : recipe.producedIn[0],
      ingredients: recipe.ingredients.map((i) => ({
        ...i,
        name: items.find((item) => item.className === i.item).name,
        amountMin: (60 / recipe.time) * i.amount,
      })),
      products: recipe.products.map((p) => ({
        ...p,
        name: items.find((item) => item.className === p.item).name,
        amountMin: (60 / recipe.time) * p.amount,
      })),
      rating: getRating(recipe),
    };
  });

// const equipmentRecipes = Object.keys(data.recipes)
//   .filter((key) => !data.recipes[key].forBuilding)
//   .filter((r) => !r.inMachine)
//   .map((key) => {
//     const recipe = data.recipes[key];
//     return {
//       ...recipe,
//       ingredients: recipe.ingredients.map((i) => ({
//         ...i,
//         name: items.find((item) => item.className === i.item).name,
//         amountMin: (60 / recipe.time) * i.amount,
//       })),
//       products: recipe.products.map((p) => ({
//         ...p,
//         name: items.find((item) => item.className === p.item).name,
//         amountMin: (60 / recipe.time) * p.amount,
//       })),
//     };
//   });

const buildings = simple.buildings.map((building) => {
  const found = Object.keys(data.buildings).find(
    (key) => data.buildings[key].name === building.name
  );
  return found ? { ...building, ...data.buildings[found] } : building;
});

const buildables = Object.keys(data.buildings).map((key) => {
  const buildable = data.buildings[key];
  return {
    className: buildable.className,
    name: buildable.name,
    slug: buildable.slug,
    description: buildable.description,
  };
});

// Recipes for buildables
const buildableRecipes = Object.keys(data.recipes)
  .filter((key) => data.recipes[key].forBuilding || !data.recipes[key].inMachine)
  .map((key) => {
    const recipe = data.recipes[key];

    return {
      ...recipe,
      producedIn: recipe.producedIn[0],
      ingredients: recipe.ingredients.map((i) => ({
        ...i,
        name: items.find((item) => item.className === i.item).name,
        amountMin: (60 / recipe.time) * i.amount,
      })),
      products: recipe.products.map((p) => ({
        ...p,
        name: items.find((item) => item.className === p.item)
          ? items.find((item) => item.className === p.item).name
          : buildables.find((building) => building.className === p.item).name,
        amountMin: (60 / recipe.time) * p.amount,
      })),
    };
  });

// all resource keys
const resources = Object.keys(data.resources).map((key) => {
  const resource = data.resources[key];
  const product = items.find((p) => p.className === key);
  return {
    className: key,
    name: product.name,
    slug: product.slug,
    max: resource.max,
    pingColor: resource.pingColor,
  };
});

// all belts
const belts = simple.belts.map((belt) => {
  return {
    className: belt.className,
    name: belt.name,
    rate: belt.rate,
    slug: belt.key_name,
  };
});

// power generators
const generators = Object.keys(data.generators).map((key) => {
  const generator = data.generators[key];
  return {
    className: generator.className,
    fuel: generator.fuel,
    powerProduction: generator.powerProduction,
  };
});

const miners = Object.keys(data.miners).map((key) => {
  const miner = data.miners[key];
  return {
    className: miner.className,
    allowedResources: miner.allowedResources,
    extractionRate: 0, // TODO: FIX
  };
});

const schematics = Object.keys(data.schematics).map((key) => {
  const schematic = data.schematics[key];
  return {
    className: schematic.className,
    type: schematic.type,
    name: schematic.name,
    slug: schematic.slug,
    cost: schematic.cost,
    unlock: schematic.unlock,
    tier: schematic.tier,
    time: schematic.time,
    mam: schematic.mam,
    alternate: schematic.alternate,
  };
});

const obj = {
  items,
  recipes,
  buildableRecipes,
  resources,
  belts,
  buildings,
  buildables,
  generators,
  miners,
  schematics,
};

fs.writeFileSync(`./src/libs/satisfactory/data/v1000/data.json`, JSON.stringify(obj, null, 2));

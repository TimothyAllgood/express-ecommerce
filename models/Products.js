const mongoose = require(`mongoose`);

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    date: {
        type: Date,
        default: new Date().localeDateString()
    },
    img: String,
    category: Array,
});

const productsArray = [
    {
        name: `Lorem 1`,
        description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus exercitationem quaerat sit esse sed mollitia molestiae sapiente temporibus obcaecati quod, impedit asperiores voluptate suscipit odit a maiores numquam vitae nostrum!`,
        price: 100,
        img: `https://picsum.photos/150/150`,
        category: `Type One`
    },
    {
        name: `Lorem 2`,
        description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus exercitationem quaerat sit esse sed mollitia molestiae sapiente temporibus obcaecati quod, impedit asperiores voluptate suscipit odit a maiores numquam vitae nostrum!`,
        price: 100,
        img: `https://picsum.photos/150/150`,
        category: `Type One`
    }, {
        name: `Lorem 3`,
        description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus exercitationem quaerat sit esse sed mollitia molestiae sapiente temporibus obcaecati quod, impedit asperiores voluptate suscipit odit a maiores numquam vitae nostrum!`,
        price: 100,
        img: `https://picsum.photos/150/150`,
        category: `Type Three`
    }, {
        name: `Lorem 4`,
        description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus exercitationem quaerat sit esse sed mollitia molestiae sapiente temporibus obcaecati quod, impedit asperiores voluptate suscipit odit a maiores numquam vitae nostrum!`,
        price: 100,
        img: `https://picsum.photos/150/150`,
        category: `Type Two`
    }, {
        name: `Lorem 5`,
        description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus exercitationem quaerat sit esse sed mollitia molestiae sapiente temporibus obcaecati quod, impedit asperiores voluptate suscipit odit a maiores numquam vitae nostrum!`,
        price: 100,
        img: `https://picsum.photos/150/150`,
        category: `Type Two`
    }, {
        name: `Lorem 6`,
        description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus exercitationem quaerat sit esse sed mollitia molestiae sapiente temporibus obcaecati quod, impedit asperiores voluptate suscipit odit a maiores numquam vitae nostrum!`,
        price: 100,
        img: `https://picsum.photos/150/150`,
        category: `Type Two`
    }, {
        name: `Lorem 7`,
        description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus exercitationem quaerat sit esse sed mollitia molestiae sapiente temporibus obcaecati quod, impedit asperiores voluptate suscipit odit a maiores numquam vitae nostrum!`,
        price: 100,
        img: `https://picsum.photos/150/150`,
        category: `Type Two`
    }, {
        name: `Lorem 8`,
        description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus exercitationem quaerat sit esse sed mollitia molestiae sapiente temporibus obcaecati quod, impedit asperiores voluptate suscipit odit a maiores numquam vitae nostrum!`,
        price: 100,
        img: `https://picsum.photos/150/150`,
        category: `Type Three`
    }, {
        name: `Lorem 9`,
        description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus exercitationem quaerat sit esse sed mollitia molestiae sapiente temporibus obcaecati quod, impedit asperiores voluptate suscipit odit a maiores numquam vitae nostrum!`,
        price: 100,
        img: `https://picsum.photos/150/150`,
        category: `Type Three`
    }, {
        name: `Lorem 10`,
        description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus exercitationem quaerat sit esse sed mollitia molestiae sapiente temporibus obcaecati quod, impedit asperiores voluptate suscipit odit a maiores numquam vitae nostrum!`,
        price: 100,
        img: `https://picsum.photos/150/150`,
        category: `Type Three`
    },
]
const Products = new mongoose.model(`Products`, productSchema);
module.exports = {
    Products,
    productsArray,
};

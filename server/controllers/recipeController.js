require('../models/database')
require('dotenv').config()
const Category = require('../models/Category')
const Recipe = require('../models/Recipe')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersDB = {
  users: require('../models/users.json'),
  setUsers: function (data) {
    this.users = data
  }
}

/**
 * GET /
 * Homepage
 */

exports.homepage = async (req, res) => {
  //exports.homepage.. isko search karna hai
  try {
    limitNumber = 5
    const categories = await Category.find({}).limit(limitNumber)
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber)
    const thai = await Recipe.find({ category: 'Thai' }).limit(limitNumber)
    const american = await Recipe.find({ category: 'American' }).limit(
      limitNumber
    )
    const chinese = await Recipe.find({ category: 'Chinese' }).limit(
      limitNumber
    )

    const food = { latest, thai, american, chinese }
    res.render('index', { title: 'Cooking Blog - Home', categories, food })
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error occured' })
  }
}

/**
 * GET /
 * Categories
 */
exports.exploreCategories = async (req, res) => {
  try {
    limitNumber = 20
    const categories = await Category.find({}).limit(limitNumber)
    res.render('categories', { title: 'Cooking Blog - categories', categories })
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error occured' })
  }
}

/**
 * GET /
 * Categories
 */

exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id
    let limitNumber = 20
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    )
    res.render('categories', {
      title: 'Cooking Blog - categories',
      categoryById
    })
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error occured' })
  }
}

/**
 * GET /recipe/:id
 * Recipe
 */

exports.exploreRecipe = async (req, res) => {
  //exports.homepage.. isko search karna hai
  try {
    let recipeId = req.params.id
    const recipe = await Recipe.findById(recipeId)
    res.render('recipe', { title: 'Cooking Blog - Recipe', recipe })
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error occured' })
  }
}

/**
 * GET /recipe/:id
 * Recipe
 */
exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true }
    })
    res.render('search', { title: 'Cooking Blog - Search', recipe })
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error occured' })
  }
}

/**
 * GET /explore-latest
 * Explore Latest
 */
exports.exploreLatest = async (req, res) => {
  try {
    let limitNumber = 20
    let recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber)
    res.render('explore-latest', {
      title: 'Cooking Blog - Explore Latest',
      recipe
    })
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error occured' })
  }
}

/**
 * GET /explore-latest
 * Explore Latest
 */
exports.submitRecipe = async (req, res) => {
  const infoErrors = req.flash('infoErrors')
  const infoSubmitObj = req.flash('infoSubmit')
  res.render('submit-recipe', {
    title: 'Cooking Blog - Submit Recipe',
    infoErrors,
    infoSubmitObj
  })
}

/**
 * POST /Submit-Recipe
 * Submit-Recipe
 */
exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile
    let uploadPath
    let newImageName

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files were uploaded.')
    } else {
      imageUploadFile = req.files.image
      newImageName = +Date.now() + '_' + imageUploadFile.name
      uploadPath =
        require('path').resolve('./') + '/public/uploads/' + newImageName
      imageUploadFile.mv(uploadPath, err => {
        if (err) console.log('Image uploading Failed.')
      })
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    })
    await newRecipe.save()
    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe')
  } catch (error) {
    req.flash('infoErrors', error)
    res.redirect('/submit-recipe')
  }
}

/**
 * POST /update-recipe
 * Update Recipe
 */
exports.getRecipe = async (req, res) => {
  try {
    let updateId = req.params.id
    const recipe = await Recipe.findById(updateId)
    const allCategory = await Category.find({})
    // if(allCategory.name == recipe.category){selected = "selected";} else{ selected = "";}
    res.render('get-recipe', {
      title: 'Cooking Blog - Update Recipe',
      recipe,
      allCategory
    })
  } catch (error) {
    res.status(500).send({ message: error.message || '404 - Page not Found' })
  }
}

/**
 * POST /submit-update
 * Submit Update
 */
exports.updateRecipe = async (req, res) => {
  let id = req.params.id
  let new_image = ''
  let imageUploadFile
  let uploadPath
  let newImageName

  if (!req.files || Object.keys(req.files).length === 0) {
    new_image = req.body.old_image
  } else {
    //Delete previous image from uploads folder
    fs.unlinkSync(
      require('path').resolve('./') + '/public/uploads/' + req.body.old_image
    )

    //Move new file into upload folder
    imageUploadFile = req.files.image
    newImageName = +Date.now() + '_' + imageUploadFile.name
    uploadPath =
      require('path').resolve('./') + '/public/uploads/' + newImageName
    imageUploadFile.mv(uploadPath, err => {
      if (err) console.log('Image uploading Failed.')
    })
  }

  await Recipe.findByIdAndUpdate(
    id,
    {
      email: req.body.email,
      name: req.body.name,
      description: req.body.description,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message, type: 'danger' })
      } else {
        res.redirect('/dashboard')
      }
    }
  ).clone()
}

// /**
//  * POST /
//  * Middleware
//  */

// exports.authenticateJWT = async (req, res, next) => {
//   const authHeader = req.cookies.token
//   try {
//     const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
//     req.user = user
//   } catch (err) {
//     res.clearCookie('token')
//     return res.redirect('/')
//   }
// }

/**
 * POST /
 * Login
 */

exports.userLogin = async (req, res) => {
  // Read username and password from request body
  const { username, password } = req.body
  // Filter user from the users array by username and password
  const user = usersDB.users.find(
    u => u.username === username && bcrypt.compareSync(password, u.password)
  )
  if (user) {
    //Generate an access token
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    )
    res.cookies('token', accessToken)
    res.json({ accessToken })
  } else {
    res.status(401).send('Username or password incorrect')
  }
}

/**
 * POST /
 * SignUp
 */

exports.handleNewUser = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username && !password)
      res.send(400).json({ message: 'Username and password required.' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = { username, password: hashedPassword }
    usersDB.setUsers([...usersDB.users, user])
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'models', 'users.json'),
      JSON.stringify(usersDB.users)
    )
    console.log(usersDB.users)
    res.status(201).json({ success: `New User ${user} created successfully` })
  } catch (error) {
    console.log(error)
    res.status(500).send('Something went wrong')
  }
}

/**
 * GET /
 * Dashbaord
 */

exports.dashboard = async (req, res) => {
  //exports.homepage.. isko search karna hai
  try {
    const recipe = await Recipe.find({})
    // const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber); category
    res.render('dashboard', { title: 'Cooking Blog - Dashboard', recipe })
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error occured' })
  }
}

// POST /logout
exports.userLogout = async (req, res) => {
  // Remove the JWT from the client-side cookie
  res.clearCookie('token')

  // Redirect the user to the login page
  res.json({ message: 'logout ho gaya' })
}

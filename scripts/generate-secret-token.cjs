const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// Define the path to the .env file where the SECRET_TOKEN will be stored
const tokenFilePath = path.resolve(__dirname, '../.env')

/**
 * Generates a new SECRET_TOKEN using a secure random method.
 * The token is generated using the crypto module's randomBytes function,
 * which produces cryptographically strong pseudo-random data.
 *
 * @returns {string} A hexadecimal string representing the generated token.
 */
const generateSecretToken = () => crypto.randomBytes(32).toString('hex')

/**
 * Reads the content of the specified .env file.
 *
 * @param {string} filePath - The path to the .env file.
 * @returns {string} The content of the .env file.
 * @throws Will exit the process if the file cannot be read.
 */
const readEnvFile = filePath => {
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch (error) {
    console.error(`Error reading the .env file: ${error.message}`)
    process.exit(1)
  }
}

/**
 * Writes the specified content back to the .env file.
 *
 * @param {string} filePath - The path to the .env file.
 * @param {string} content - The content to write to the file.
 * @throws Will exit the process if the file cannot be written.
 */
const writeEnvFile = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, content)
  } catch (error) {
    console.error(`Error writing to the .env file: ${error.message}`)
    process.exit(1)
  }
}

// Read the existing .env file to check if SECRET_TOKEN already exists
let envContent = readEnvFile(tokenFilePath)

// Generate a new token
const secretToken = generateSecretToken()

// Ensure the SECRET_TOKEN is appended correctly, avoiding potential bugs with line endings
if (envContent.includes('SECRET_TOKEN=')) {
  envContent = envContent.replace(/SECRET_TOKEN=.*/g, `SECRET_TOKEN=${secretToken}`)
} else {
  // Append SECRET_TOKEN only if it doesn't already exist, ensuring a newline if necessary
  envContent = `${envContent.trim()}\nSECRET_TOKEN=${secretToken}\n`
}

// Write the updated content back to the .env file
writeEnvFile(tokenFilePath, envContent)

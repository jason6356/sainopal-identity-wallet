import { decode, encode } from "base-64"
import * as SQLite from "expo-sqlite"
import wordsList from "../../en.json"
const db = SQLite.openDatabase("db.db")

class RecoveryPhraseTable {
  static init(callback?: () => void) {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS recoveryPhrase (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT);",
        [],
        () => {
          console.log("RecoveryPhrase table created successfully!")
          if (callback) {
            callback()
          }
        },
        (transaction, error) => {
          console.log("Error creating recoveryPhrase table: " + error.message)
          return true
        }
      )
    })
  }

  static addPhrasesIfNotExist(callback: () => void) {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='recoveryPhrase';",
        [],
        (_, { rows }) => {
          const tableExists = rows.length > 0

          if (!tableExists) {
            tx.executeSql(
              "CREATE TABLE IF NOT EXISTS recoveryPhrase (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT);",
              [],
              () => {
                console.log("recoveryPhrase table created successfully!")

                const selectedWords = []
                const shuffledWords = wordsList.sort(() => Math.random() - 0.5)
                for (let i = 0; i < 12; i++) {
                  selectedWords.push(encode(shuffledWords[i]))
                }

                selectedWords.forEach((selectedWords) => {
                  tx.executeSql(
                    "INSERT INTO recoveryPhrase (word) VALUES (?);",
                    [selectedWords],
                    () => {
                      console.log(`Inserted word: ${selectedWords}`)
                    },
                    (transaction, error) => {
                      console.log("Error inserting word:", error.message)
                      return false
                    }
                  )
                })

                if (callback) {
                  callback()
                }
              },
              (transaction, error) => {
                console.log(
                  "Error creating recoveryPhrase table: " + error.message
                )
                return false
              }
            )
          } else {
            if (callback) {
              callback()
            }
          }
        }
      )
    })
  }

  static getAllPhrasesArray(callback: (phrases: any[]) => void) {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM recoveryPhrase;", [], (_, { rows }) => {
        const recoveryPhraseData: any[] = rows._array
        const decodedData = recoveryPhraseData.map((item) => {
          return {
            ...item,
            word: item.word ? decode(item.word) : null,
          }
        })

        callback(decodedData)
      })
    })
  }

  static getAllEncodedPhrases(callback: (phrases: string) => void) {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM recoveryPhrase;", [], (_, { rows }) => {
        const recoveryPhraseData: any[] = rows._array
        const decodedWords: string[] = recoveryPhraseData.map(
          (item) => item.word
        )
        const decodedString: string = decodedWords.join(" ")
        callback(decodedString)
      })
    })
  }

  static getAllEncodedPhrasesArray(callback: (phrases: any[]) => void) {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM recoveryPhrase;", [], (_, { rows }) => {
        const recoveryPhraseData: any[] = rows._array
        const decodedData = recoveryPhraseData.map((item) => {
          return {
            ...item,
            word: item.word ? item.word : null,
          }
        })

        callback(decodedData)
      })
    })
  }

  static updatePhrase(recoveryPhrase: string, callback: () => void) {
    const words = recoveryPhrase.split(/\s+/)

    db.transaction((tx) => {
      words.forEach((word, index) => {
        tx.executeSql(
          "UPDATE recoveryPhrase SET word = ? WHERE id = ?;",
          [encode(word), index + 1], // Assuming the index starts from 1
          () => {
            console.log(
              `Recovery phrase at index ${index + 1} updated successfully!`
            )
            if (index === words.length - 1) {
              // Call the callback after updating the last word
              callback()
            }
          },
          (transaction, error) => {
            console.log(
              `Error updating recovery phrase at index ${index + 1}: ${
                error.message
              }`
            )
            return true
          }
        )
      })
    })
  }

  static deletePhrase(id: number, callback: () => void) {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM recoveryPhrase WHERE id = ?;", [id], () => {
        console.log("Recovery phrase deleted successfully!")
        callback()
      })
    })
  }

  //Only one decoded
  static getAllPhrases(callback: (phrases: string) => void) {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM recoveryPhrase;", [], (_, { rows }) => {
        const recoveryPhraseData: any[] = rows._array
        const decodedWords: string[] = recoveryPhraseData.map((item) =>
          decode(item.word)
        )
        const decodedString: string = decodedWords.join(" ")
        callback(decodedString)
      })
    })
  }

  static dropTable(callback?: () => void) {
    db.transaction((tx) => {
      tx.executeSql(
        "DROP TABLE IF EXISTS recoveryPhrase;",
        [],
        () => {
          console.log("RecoveryPhrase table dropped successfully!")
          if (callback) {
            callback()
          }
        },
        (transaction, error) => {
          console.log("Error dropping recoveryPhrase table: " + error.message)
          return true
        }
      )
    })
  }
}

export default RecoveryPhraseTable

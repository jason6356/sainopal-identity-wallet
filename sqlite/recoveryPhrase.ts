import * as SQLite from "expo-sqlite"
import wordsList from "../en.json"
import { encode, decode } from "base-64"
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
                    (error) => {
                      console.log("Error inserting word:", error.message)
                    }
                  )
                })

                if (callback) {
                  callback()
                }
              },
              (error) => {
                console.log(
                  "Error creating recoveryPhrase table: " + error.message
                )
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

  static updatePhrase(id: number, word: string, callback: () => void) {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE recoveryPhrase SET word = ? WHERE id = ?;",
        [word, id],
        () => {
          console.log("Recovery phrase updated successfully!")
          callback()
        },
        (transaction, error) => {
          console.log("Error updating recovery phrase: " + error.message)
          return true
        }
      )
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

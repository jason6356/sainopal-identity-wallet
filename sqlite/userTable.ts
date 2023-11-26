import * as SQLite from "expo-sqlite"
import { encode, decode } from "base-64"

const db = SQLite.openDatabase("db.db")

class UserTable {
  static init(): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, password TEXT, wallet TEXT);",
            [],
            () => {
              console.log("User table created successfully!")
              resolve()
            },
            (transaction, error) => {
              console.log("Error creating user table: " + error)
              reject(error)
              return true
            }
          )
        },
        (error) => {
          console.log("Transaction error: " + error)
          reject(error)
        },
        () => {
          console.log("Transaction completed successfully!")
        }
      )
    })
  }

  static getPassword(
    successCallback: (password: string) => void,
    errorCallback: (error: Error) => void
  ) {
    db.transaction(
      (tx) => {
        tx.executeSql("SELECT * FROM user;", [], (_, { rows }) => {
          const userData = rows._array
          const password = userData.length > 0 ? userData[0].password : ""
          successCallback(decode(password))
        })
      },
      (error) => {
        errorCallback(new Error("Error retrieving password: " + error))
      }
    )
  }

  static storeUserData(encryptedPassword: string, wallet: string) {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists user (id integer primary key not null, password text, wallet text);"
      )
      tx.executeSql(
        "select * from user limit 1;",
        [],
        (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            tx.executeSql(
              "update user set password = ?, wallet = ? where id = ?;",
              [encode(encryptedPassword), wallet, _array[0].id]
            )
          } else {
            tx.executeSql(
              "insert into user (password, wallet) values (?, ?);",
              [encode(encryptedPassword), wallet]
            )
          }
        }
      )
    })
  }

  static updatePassword(encryptedPassword: string) {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY NOT NULL, password TEXT, wallet TEXT);"
      )
      tx.executeSql(
        "SELECT * FROM user LIMIT 1;",
        [],
        (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            tx.executeSql("UPDATE user SET password = ? WHERE id = ?;", [
              encode(encryptedPassword),
              _array[0].id,
            ])
          } else {
          }
        }
      )
    })
  }

  static getAllUsers(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM user;", [], (_, { rows }) => {
          const users = rows._array
          resolve(users)
        })
      })
    })
  }

  static getUserById(id: number): Promise<any | null> {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM user WHERE id = ?;",
          [id],
          (_, { rows }) => {
            const user = rows.length > 0 ? rows.item(0) : null
            resolve(user)
          }
        )
      })
    })
  }

  static updateUser(
    id: number,
    password: string,
    wallet: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE user SET password = ?, wallet = ? WHERE id = ?;",
          [password, wallet, id],
          () => {
            console.log("User updated successfully!")
            resolve()
          },
          (transaction, error) => {
            console.log("Error updating user: " + error)
            reject(error)
            return true
          }
        )
      })
    })
  }

  static dropTable(callback?: () => void) {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "DROP TABLE IF EXISTS user;",
          [],
          () => {
            console.log("User table dropped successfully!")
            if (callback) {
              callback()
            }
          },
          (transaction, error) => {
            console.log("Error dropping user table: " + error.message)
            return true
          }
        )
      },
      (error) => {
        console.log("Transaction error: " + error.message)
      }
    )
  }

  static deleteUser(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql("DELETE FROM user WHERE id = ?;", [id], () => {
          console.log("User deleted successfully!")
          resolve()
        })
      })
    })
  }
}

async function recoveryPhraseLocal(): Promise<string> {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM recoveryPhrase;", [], (_, { rows }) => {
        const recoveryPhraseData: any = rows._array
        const wordsOnly = recoveryPhraseData.map(
          (item: { word: any }) => item.word
        )
        const wordsString = wordsOnly.join(" ")
        console.log("Wallet Key(Recovery Phrase) :", wordsString)
        resolve(wordsString)
      })
    })
  })
}

export { recoveryPhraseLocal }

export default UserTable

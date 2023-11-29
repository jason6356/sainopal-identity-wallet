import * as SQLite from "expo-sqlite"

const db = SQLite.openDatabase("db.db")

class LoginFailedTable {
  static init(): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS loginFailed (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp TEXT);",
            [],
            () => {
              console.log("LoginFailed table created successfully!")

              // Check if there are any rows in the table
              tx.executeSql(
                "SELECT COUNT(*) as count FROM loginFailed;",
                [],
                (_, { rows }) => {
                  const rowCount = rows.item(0).count

                  if (rowCount === 0) {
                    // If no rows, insert the default values
                    tx.executeSql("INSERT INTO loginFailed DEFAULT VALUES;")
                    console.log("Empty row inserted into LoginFailed table.")
                  } else {
                    console.log("LoginFailed table already contains rows.")
                  }

                  resolve()
                },
                (transaction, error) => {
                  console.log("Error checking row count: " + error)
                  reject(error)
                  return true
                }
              )
            },
            (transaction, error) => {
              console.log("Error creating loginFailed table: " + error)
              reject(error)
              return true
            }
          )
        },
        (error) => {
          console.log("Transaction error: " + error)
          reject(error)
        }
      )
    })
  }

  static getLastFailedLogin(): Promise<{ timestamp: string } | null> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            "SELECT * FROM loginFailed ORDER BY id DESC LIMIT 1;",
            [],
            (_, { rows }) => {
              const lastFailedLogin = rows.length > 0 ? rows.item(0) : null
              resolve(lastFailedLogin)
            },
            (transaction, error) => {
              console.log("Error fetching last failed login: " + error)
              reject(error)
              return true
            }
          )
        },
        (error) => {
          console.log("Transaction error: " + error)
          reject(error)
        }
      )
    })
  }

  static updateFailedLogin(): Promise<void> {
    return new Promise((resolve, reject) => {
      const threeMinutesLater = new Date()
      threeMinutesLater.setTime(new Date().getTime() + 3 * 60 * 1000)
      const updatedTimestamp = threeMinutesLater.toISOString()

      db.transaction(
        (tx) => {
          tx.executeSql(
            "UPDATE loginFailed SET timestamp = ? WHERE id = (SELECT MAX(id) FROM loginFailed);",
            [updatedTimestamp],
            () => {
              console.log("Failed login updated successfully!")
              resolve()
            },
            (transaction, error) => {
              console.log("Error updating failed login: " + error)
              reject(error)
              return true
            }
          )
        },
        (error) => {
          console.log("Transaction error: " + error)
          reject(error)
        }
      )
    })
  }

  static dropTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            "DROP TABLE IF EXISTS loginFailed;",
            [],
            () => {
              console.log("LoginFailed table dropped successfully!")
              resolve()
            },
            (transaction, error) => {
              console.log("Error dropping loginFailed table: " + error)
              reject(error)
              return true
            }
          )
        },
        (error) => {
          console.log("Transaction error: " + error)
          reject(error)
        }
      )
    })
  }
}

export default LoginFailedTable

**Найти фильмы**
----
  Запрос возвращает информацию о фильмах, которые соответствуют переданному названию

* **URL**

  /search/:query

* **Method:**

  `GET`
  
*  **URL Параметры**
 
   `query=[string]`	Строка с названием фильма, который необходимо найти

* **Body параметры**

  Нет

* **Success Response:**

  * **Content:** 
  ```json
    "isOK": true,
    "message": "Movies matching your query",
    "data": [
        {
            "mid": 680,
            "title": "Криминальное чтиво",
            "poster_url": "http://image.tmdb.org/t/p/w185//tEfPt3FQ1on0DLRM3QOlliLc9Lk.jpg",
            "score": 84,
            "release": "1994"
        }
    ]
    ```
 
* **Error Response:**

  * **Content:** 
    ```json
    "isOK": false,
    "message": "No such movie. Try different name!",
    "data": {}
    ```
  Или

  * **Content:**
  ```json
    "isOK": false,
    "message": "Error happened while getting movies from THEMOOVIEDB",
    "data": {MoovieDB Error Object}
    ```
    
**Получить вечеринку**
----
  Запрос возвращает информацию о вечеринке с соответствующим id

* **URL**

  /party/:pid&:user_id

* **Method:**

  `GET`
  
*  **URL Параметры**
 
   `pid=[string]`	Уникальный идентификатор вечеринки, например "123qwe"  
   `user_id=[integer]`	Идентификатор пользователя ВКонтакте, который создаёт вечеринку  

* **Body параметры**

  Нет

* **Success Response:**

   * **Content:**
   ```json
    "isOK": true,
    "message": "Party was found!",
    "data": {
        "pid": "1v11k06bdk0ox9smo2ku1i9qzp2qymaa",
        "title": "Финальное название",
        "owner": {
            "user_id": 1,
            "first_name": "Павел",
            "last_name": "Дуров",
            "photo": "https://pp.userapi.com/c836333/v836333001/31191/qC6rVW5YSD8.jpg?ava=1"
        },
        "guests": [
            {
                "user_id": 142375315,
                "photo": "https://sun1-89.userapi.com/c840238/v840238315/a470/ch5_6mNptfk.jpg?ava=1",
                "first_name": "Дмитрий",
                "last_name": "Котяшов"
            },
            {
                "user_id": 19592568,
                "photo": "https://pp.userapi.com/v5RCvfVk2NivLnmiZqL6jSty44cktFo3NchGxQ/ogXVNSwKQg4.jpg?ava=1",
                "first_name": "Артём",
                "last_name": "Скачков"
            },
            {
                "user_id": 5397033,
                "photo": "https://sun1-25.userapi.com/c604823/v604823033/3fed3/ADFt2xwnO48.jpg?ava=1",
                "first_name": "Олег",
                "last_name": "Копченов"
            },
            {
                "user_id": 19592568,
                "photo": "https://pp.userapi.com/v5RCvfVk2NivLnmiZqL6jSty44cktFo3NchGxQ/ogXVNSwKQg4.jpg?ava=1",
                "first_name": "Артём",
                "last_name": "Пепегов"
            },
            {
                "user_id": 19592568,
                "photo": "https://pp.userapi.com/v5RCvfVk2NivLnmiZqL6jSty44cktFo3NchGxQ/ogXVNSwKQg4.jpg?ava=1",
                "first_name": "Артём",
                "last_name": "ПипоКлаунов"
            }
        ],
        "date": "2019-05-03T20:59:59.000Z",
        "private": true,
        "movies": [
            {
                "movie": {
                    "mid": 20993,
                    "title": "Брат 2",
                    "poster_url": "http://image.tmdb.org/t/p/w185//4dMvp09WzDe91MVYTNp2HNgbEUh.jpg",
                    "score": 73,
                    "release": "2000"
                },
                "user": {
                    "user_id": 1,
                    "first_name": "Павел",
                    "last_name": "Дуров",
                    "photo": "https://pp.userapi.com/c836333/v836333001/31191/qC6rVW5YSD8.jpg?ava=1"
                }
            },
            {
                "movie": {
                    "mid": 20994,
                    "title": "Жмурки",
                    "poster_url": "http://image.tmdb.org/t/p/w185//vNjfpcetUTMU8wo22Wo7p7jGuFg.jpg",
                    "score": 67,
                    "release": "2005"
                },
                "user": {
                    "user_id": 19592568,
                    "first_name": "Артём",
                    "last_name": "Скачков",
                    "photo": "https://pp.userapi.com/Spw8dwKuU3tUCMeQiKb7VBdgq4uSF3EzZSBDIw/G09X32lEzoc.jpg?ava=1"
                }
            },
            {
                "movie": {
                    "mid": 20934,
                    "title": "Варвара-краса, длинная коса",
                    "poster_url": "http://image.tmdb.org/t/p/w185//hTzxZGtLayAJzDJHwH4iZL4LZQe.jpg",
                    "score": 57,
                    "release": "1969"
                },
                "user": {
                    "user_id": 1337,
                    "first_name": "DELETED",
                    "last_name": "",
                    "photo": null
                }
            }
        ]
    }
	```

* **Error Response:**

  * **Content:**
  ```json
    "isOK": false,
    "message": "Error while trying to find party in database",
    "data": {MongoDB Error Object}
    ```

  Или

  * **Content:**
  ```json
    "isOK": false,
    "message": "No party was found with given id",
    "data": {"party_id" : 123456}
    ```

  Или
  
  * **Content:**
  ```json
    "isOK": false,
    "message": "You don't have access to this party",
    "data": {}
    ```
    
**Получить вечеринки**
----
  Запрос возвращает информацию о всех предстоящих вечеринках для пользователя с соответствующим id

* **URL**

  /parties/:user_id

* **Method:**

  `GET`
  
*  **URL Параметры**
 
   `user_id=[integer]`	Идентификатор пользователя ВКонтакте, который запрашивает информацию о его предстоящих вечеринках  

* **Body параметры**

  Нет

* **Success Response:**

   * **Content:**
   ```json
    "isOK": true,
    "message": "Upcoming parties for this user",
    "data": [
        {
            "pid": "1v11k06bdk0ox9smo2ku1i9qzp2qymaa",
            "title": "Финальное название",
            "owner": {
                "user_id": 1,
                "first_name": "Павел",
                "last_name": "Дуров",
                "photo": "https://pp.userapi.com/c836333/v836333001/31191/qC6rVW5YSD8.jpg?ava=1"
            },
            "guests": [
                {
                    "user_id": 142375315,
                    "photo": "https://sun1-89.userapi.com/c840238/v840238315/a470/ch5_6mNptfk.jpg?ava=1",
                    "first_name": "Дмитрий",
                    "last_name": "Котяшов"
                },
                {
                    "user_id": 19592568,
                    "photo": "https://pp.userapi.com/v5RCvfVk2NivLnmiZqL6jSty44cktFo3NchGxQ/ogXVNSwKQg4.jpg?ava=1",
                    "first_name": "Артём",
                    "last_name": "Скачков"
                },
                {
                    "user_id": 5397033,
                    "photo": "https://sun1-25.userapi.com/c604823/v604823033/3fed3/ADFt2xwnO48.jpg?ava=1",
                    "first_name": "Олег",
                    "last_name": "Копченов"
                },
                {
                    "user_id": 19592568,
                    "photo": "https://pp.userapi.com/v5RCvfVk2NivLnmiZqL6jSty44cktFo3NchGxQ/ogXVNSwKQg4.jpg?ava=1",
                    "first_name": "Артём",
                    "last_name": "Пепегов"
                },
                {
                    "user_id": 19592568,
                    "photo": "https://pp.userapi.com/v5RCvfVk2NivLnmiZqL6jSty44cktFo3NchGxQ/ogXVNSwKQg4.jpg?ava=1",
                    "first_name": "Артём",
                    "last_name": "ПипоКлаунов"
                }
            ],
            "date": "2019-05-03T20:59:59.000Z",
            "private": true,
            "movies": [
                {
                    "movie": {
                        "mid": 20993,
                        "title": "Брат 2",
                        "poster_url": "http://image.tmdb.org/t/p/w185//4dMvp09WzDe91MVYTNp2HNgbEUh.jpg",
                        "score": 73,
                        "release": "2000"
                    },
                    "user": {
                        "user_id": 1,
                        "first_name": "Павел",
                        "last_name": "Дуров",
                        "photo": "https://pp.userapi.com/c836333/v836333001/31191/qC6rVW5YSD8.jpg?ava=1"
                    }
                },
                {
                    "movie": {
                        "mid": 20994,
                        "title": "Жмурки",
                        "poster_url": "http://image.tmdb.org/t/p/w185//vNjfpcetUTMU8wo22Wo7p7jGuFg.jpg",
                        "score": 67,
                        "release": "2005"
                    },
                    "user": {
                        "user_id": 19592568,
                        "first_name": "Артём",
                        "last_name": "Скачков",
                        "photo": "https://pp.userapi.com/Spw8dwKuU3tUCMeQiKb7VBdgq4uSF3EzZSBDIw/G09X32lEzoc.jpg?ava=1"
                    }
                },
                {
                    "movie": {
                        "mid": 20934,
                        "title": "Варвара-краса, длинная коса",
                        "poster_url": "http://image.tmdb.org/t/p/w185//hTzxZGtLayAJzDJHwH4iZL4LZQe.jpg",
                        "score": 57,
                        "release": "1969"
                    },
                    "user": {
                        "user_id": 1337,
                        "first_name": "DELETED",
                        "last_name": "",
                        "photo": null
                    }
                }
            ]
        }
    ]
   ```

* **Error Response:**

  Все Error Response из запроса GET /party, а также
  
  * **Content:**
  ```json
    "isOK": false,
    "message": "No upcoming parties were found for user with this id",
    "data": {"user_id" : 123456}
    ```

**Создать вечеринку**
----
  Запрос создаёт вечеринку с уникальным идентификатором

* **URL**

  /party

* **Method:**

  `POST`
  
*  **URL Параметры**
 
   Нет

* **Body параметры**

    `title: [string]`	Строка с названием вечеринки  
    `user_id: [integer]`	Идентификатор пользователя ВКонтакте, который создаёт вечеринку  
    `date : [string]` Дата вечеринки в формате "2077-12-25"  
    `isPrivate : [Boolean]` Является ли вечеринка приватной(__Необязателен__)  

* **Success Response:**

   * **Content:** 
   ```json
    "isOK": true,
    "message": "Party was added!",
    "data": {
        "pid": "pxq1jtee2x2ke9b6cezgj4z62aeui5i8"
    }
    ```
 
* **Error Response:**
  
  * **Content:** 
  ```json
    "isOK": false,
    "message": "Error while adding party to database",
    "data": {MongoDB Error Object}
    ```

**Добавить фильм**
----
  Запрос добавляет в вечеринку новый фильм

* **URL**

  /movie

* **Method:**

  `POST`
  
*  **URL Параметры**
 
   Нет

* **Body параметры**

    `mid : [integer]`	Уникальный идентификатор фильма в базе THEMOOVIEDB  
    `user_id : [integer]`	Идентификатор пользователя ВКонтакте, который добавляет фильм  
    `pid" : [string]`	Идентификатор вечеринки в которую добавляется фильм  

* **Success Response:**

   * **Content:**
   ```json
    "isOK": true,
    "message": "Movie was added to party!",
    "data": {
        "movie": {
            "mid": 20997,
            "title": "Lost Worlds: Life in the Balance",
            "poster_url": "http://image.tmdb.org/t/p/w185//fjqltPk4lIVeZ2eX7URNK0abFKC.jpg",
            "score": 58,
            "release": "2001"
        },
        "user": {
            "user_id": 1,
            "first_name": "Павел",
            "last_name": "Дуров",
            "photo": "https://pp.userapi.com/c836333/v836333001/31191/qC6rVW5YSD8.jpg?ava=1"
        }
    }
   ```
 
* **Error Response:**
  
  * **Content:** 
  ```json
    "isOK": false,
    "message": "Can't get party with given id",
    "data": {MongoDB Error Object}
    ```

  Или
  
  * **Content:**
  ```json
    "isOK": false,
    "message": "No party was found with given id",
    "data": {"party_id" : "123qwe"}
    ```

  Или
  
  * **Content:** 
  ```json
    "isOK": false,
    "message": "Error in database while adding movie to party",
    "data": {MongoDB Error Object}
    ```

  Или
  
  * **Content:**
  ```json
    "isOK": false,
    "message": "This movie was already added",
    "data": {
        "movie": {
            "mid": 20997,
            "title": "Lost Worlds: Life in the Balance",
            "poster_url": "http://image.tmdb.org/t/p/w185//fjqltPk4lIVeZ2eX7URNK0abFKC.jpg",
            "score": 58,
            "release": "2001"
        },
        "user": {
            "user_id": 1,
            "first_name": "Павел",
            "last_name": "Дуров",
            "photo": "https://pp.userapi.com/c836333/v836333001/31191/qC6rVW5YSD8.jpg?ava=1"
        }
    }
    ```

**Добавить гостей в вечеринку**
----
  Запрос добавляет гостей в вечеринку с соттветствующим идентификатором

* **URL**

  /guests

* **Method:**

  `POST`
  
*  **URL Параметры**
 
   Нет

* **Body параметры**

    `pid: [string]`	Идентификатор вечеринки в которую необходимо добавить гостей  
    `guests: [Array]`	Массив гостей, которых необходимо добавить. Пример объекта гостя:
    ```json 
    {
    "photo_200": "https://sun1-25.userapi.com/c604823/v604823033/3fed3/ADFt2xwnO48.jpg?ava=1",
    "id": 5397033,
    "sex": 2,
    "first_name": "Олег",
    "last_name": "Копченов"
  }
  ```

* **Success Response:**

   * **Content:**
   ```json
    "isOK": true,
    "message": "New guests were added to party!",
    "data": {}
    ```
 
* **Error Response:**
  
  * **Content:**
  ```json
    "isOK": false,
    "message": "Error while trying to add guests to this party in database",
    "data": {MongoDB Error Object}
    ```

  Или
  
  * **Content:** 
  ```json
    "isOK": false,
    "message": "All of the guests you provide already added to the party",
    "data": {[{
            "user_id": 19592568,
            "photo": "https://pp.userapi.com/v5RCvfVk2NivLnmiZqL6jSty44cktFo3NchGxQ/ogXVNSwKQg4.jpg?ava=1",
            "first_name": "Артём",
            "last_name": "ПипоКлаунов"
        }]}
	```

**Изменить настройки вечеринки**
----
  Запрос изменяет определенные настройки вечеринки

* **URL**

  /party

* **Method:**

  `PATCH`
  
*  **URL Параметры**
 
   Нет

* **Body параметры**

    * `pid: [string]`	Идентификатор вечеринки, настройки которой необходимо изменить  
    * `user_id: [integer]`	Идентификатор пользователя ВКонтакте, который пытается внести изменения  
    * `patch : [Object]`	Объект изменений вечеринки. Объект состоит из 3 опциональных полей:  
      * `title: [string]`	Название вечеринки  
      * `private: [Boolean]`	Является ли вечеринка приватной?  
      * `date: [string]`	Строка с датой вечеринки формата "2077-12-25"  

* **Success Response:**

   * **Content:**
   ```json
    "isOK": true,
    "message": "Party updated!",
    "data": {
        "_id": "5cc561eb02008627cc52ae1b",
        "pid": "1v11k06bdk0ox9smo2ku1i9qzp2qymaa",
        "title": "Финальное название",
        "owner": {
            "user_id": 1,
            "first_name": "Павел",
            "last_name": "Дуров",
            "photo": "https://pp.userapi.com/c836333/v836333001/31191/qC6rVW5YSD8.jpg?ava=1"
        },
        "guests": [
            {
                "user_id": 142375315,
                "photo": "https://sun1-89.userapi.com/c840238/v840238315/a470/ch5_6mNptfk.jpg?ava=1",
                "first_name": "Дмитрий",
                "last_name": "Котяшов"
            },
            {
                "user_id": 19592568,
                "photo": "https://pp.userapi.com/v5RCvfVk2NivLnmiZqL6jSty44cktFo3NchGxQ/ogXVNSwKQg4.jpg?ava=1",
                "first_name": "Артём",
                "last_name": "Скачков"
            },
            {
                "user_id": 5397033,
                "photo": "https://sun1-25.userapi.com/c604823/v604823033/3fed3/ADFt2xwnO48.jpg?ava=1",
                "first_name": "Олег",
                "last_name": "Копченов"
            },
            {
                "user_id": 19592568,
                "photo": "https://pp.userapi.com/v5RCvfVk2NivLnmiZqL6jSty44cktFo3NchGxQ/ogXVNSwKQg4.jpg?ava=1",
                "first_name": "Артём",
                "last_name": "Пепегов"
            },
            {
                "user_id": 19592568,
                "photo": "https://pp.userapi.com/v5RCvfVk2NivLnmiZqL6jSty44cktFo3NchGxQ/ogXVNSwKQg4.jpg?ava=1",
                "first_name": "Артём",
                "last_name": "ПипоКлаунов"
            }
        ],
        "date": "2019-05-03T20:59:59.000Z",
        "private": true,
        "movies": [
            {
                "movie": {
                    "mid": 20993,
                    "title": "Брат 2",
                    "poster_url": "http://image.tmdb.org/t/p/w185//4dMvp09WzDe91MVYTNp2HNgbEUh.jpg",
                    "score": 73,
                    "release": "2000"
                },
                "user": {
                    "user_id": 1,
                    "first_name": "Павел",
                    "last_name": "Дуров",
                    "photo": "https://pp.userapi.com/c836333/v836333001/31191/qC6rVW5YSD8.jpg?ava=1"
                }
            },
            {
                "movie": {
                    "mid": 20994,
                    "title": "Жмурки",
                    "poster_url": "http://image.tmdb.org/t/p/w185//vNjfpcetUTMU8wo22Wo7p7jGuFg.jpg",
                    "score": 67,
                    "release": "2005"
                },
                "user": {
                    "user_id": 19592568,
                    "first_name": "Артём",
                    "last_name": "Скачков",
                    "photo": "https://pp.userapi.com/Spw8dwKuU3tUCMeQiKb7VBdgq4uSF3EzZSBDIw/G09X32lEzoc.jpg?ava=1"
                }
            },
            {
                "movie": {
                    "mid": 20934,
                    "title": "Варвара-краса, длинная коса",
                    "poster_url": "http://image.tmdb.org/t/p/w185//hTzxZGtLayAJzDJHwH4iZL4LZQe.jpg",
                    "score": 57,
                    "release": "1969"
                },
                "user": {
                    "user_id": 1337,
                    "first_name": "DELETED",
                    "last_name": "",
                    "photo": null
                }
            }
        ]
    }
   ```
 
* **Error Response:**
  
  * **Content:** 
  ```json
    "isOK": false,
    "message": "Error while trying to get party from database",
    "data": {MongoDB Error Object}
    ```

  Или
  
  * **Content:** 
  ```json
    "isOK": false,
    "message": "You are not the owner of this party",
    "data": {}
    ```

  Или
  
   * **Content:** 
   ```json
    "isOK": false,
    "message": "Error while updating party object in database",
    "data": {MongoDB Error Object}
    ```

**Удалить гостя**
----
  Запрос удаляет гостя из вечеринки

* **URL**

  /guest

* **Method:**

  `DELETE`
  
*  **URL Параметры**
 
    `pid: [string]`	Идентификатор вечеринки из которой необходимо удалить гостя  
    `guest_id: [integer]`	Идентификатор ВКонтакте удаляемого гостя  

* **Body параметры**

     Нет

* **Success Response:**

  * **Content:** 
  ```json
    "isOK": true,
    "message": "Guest was deleted!",
    "data": {}
    ```
 
* **Error Response:**
  
  * **Content:** 
  ```json
    "isOK": false,
    "message": "Error while trying to delete a guest from this party",
    "data": {MongoDB Error Object}
    ```

  Или
  
  * **Content:** 
  ```json
    "isOK": false,
    "message": "No such guest to delete from this party",
    "data": {"guest_id": 123456}
    ```

**Удалить фильм**
----
  Запрос удаляет фильм из вечеринки

* **URL**

  /movie

* **Method:**

  `DELETE`
  
*  **URL Параметры**
 
    `pid: [string]`	Идентификатор вечеринки из которой необходимо удалить фильм  
    `mid: [integer]`	Уникальный THEMOOVIEDB идентификатор фильма

* **Body параметры**

     Нет

* **Success Response:**

  * **Content:** 
  ```json
    "isOK": true,
    "message": "Movie was deleted!",
    "data": {}
    ```
 
* **Error Response:**
  
  * **Content:** 
  ```json
    "isOK": false,
    "message": "Error while trying to delete a movie from this party",
    "data": {MongoDB Error Object}
    ```

  Или
  
  * **Content:** 
  ```json
    "isOK": false,
    "message": "No such movie to delete from this party",
    "data": {"guest_id": 123456}
    ```

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
 
   `pid=[string]`  
   `user_id=[integer]`  

* **Body параметры**

  Нет

* **Success Response:**

   https://kingfisher-file-uploads-prod.s3.amazonaws.com/19242/339722/7672827042850702/get_party_response.json
 
* **Error Response:**

  * **Content:** `{
    "isOK": false,
    "message": "Error while trying to find party in database",
    "data": {MongoDB Error Object}
}`

  Или

  * **Content:** `{
    "isOK": false,
    "message": "No party was found with given id",
    "data": {"party_id" : 123456}
}`

  Или
  
  * **Content:** `{
    "isOK": false,
    "message": "You don't have access to this party",
    "data": {}
}`

**Получить вечеринки**
----
  Запрос возвращает информацию о всех предстоящих вечеринках для пользователя с соответствующим id

* **URL**

  /parties/:user_id

* **Method:**

  `GET`
  
*  **URL Параметры**
 
   `user_id=[integer]`

* **Body параметры**

  Нет

* **Success Response:**

   https://kingfisher-file-uploads-prod.s3.amazonaws.com/19242/339722/4542088458270836/get_parties_response.json
 
* **Error Response:**

  Все Error Response из запроса GET /party, а также
  
  * **Content:** `{
    "isOK": false,
    "message": "No upcoming parties were found for user with this id",
    "data": {"user_id" : 123456}
}`

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

    `title: [string]`
    `user_id: [integer]`
    `date : [string]`
    `isPrivate : [Boolean]`

* **Success Response:**

   * **Content:** `{
    "isOK": true,
    "message": "Party was added!",
    "data": {
        "pid": "pxq1jtee2x2ke9b6cezgj4z62aeui5i8"
    }
}`
 
* **Error Response:**
  
  * **Content:** `{
    "isOK": false,
    "message": "Error while adding party to database",
    "data": {MongoDB Error Object}
}`

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

    `mid : [integer]`
	  `user_id : [integer]`
	  `pid" : [string]`

* **Success Response:**

   https://kingfisher-file-uploads-prod.s3.amazonaws.com/19242/339722/5167212349344412/post_movie_response.json
 
* **Error Response:**
  
  * **Content:** `{
    "isOK": false,
    "message": "Can't get party with given id",
    "data": {MongoDB Error Object}
}`

  Или
  
  * **Content:** `{
    "isOK": false,
    "message": "No party was found with given id",
    "data": {"party_id" : "123qwe"}
}`

  Или
  
  * **Content:** `{
    "isOK": false,
    "message": "Error in database while adding movie to party",
    "data": {MongoDB Error Object}
}`

  Или
  
  * **Content:** `{
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
}`

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

    `pid: [string]`
    `guests: [Array]`

* **Success Response:**

   * **Content:** `{
    "isOK": true,
    "message": "New guests were added to party!",
    "data": {}
}`
 
* **Error Response:**
  
  * **Content:** `{
    "isOK": false,
    "message": "Error while trying to add guests to this party in database",
    "data": {MongoDB Error Object}
}`

  Или
  
  * **Content:** `{
    "isOK": false,
    "message": "All of the guests you provide already added to the party",
    "data": {[{
            "user_id": 19592568,
            "photo": "https://pp.userapi.com/v5RCvfVk2NivLnmiZqL6jSty44cktFo3NchGxQ/ogXVNSwKQg4.jpg?ava=1",
            "first_name": "Артём",
            "last_name": "ПипоКлаунов"
        }]}
}`

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

    `pid: [string]`
    `user_id: [integer]`
    `patch : [Object]`

* **Success Response:**

  https://kingfisher-file-uploads-prod.s3.amazonaws.com/19242/339722/3149253100348554/patch_party_response.json
 
* **Error Response:**
  
  * **Content:** `{
    "isOK": false,
    "message": "Error while trying to get party from database",
    "data": {MongoDB Error Object}
}`

  Или
  
  * **Content:** `{
    "isOK": false,
    "message": "You are not the owner of this party",
    "data": {}
}`

  Или
  
   * **Content:** `{
    "isOK": false,
    "message": "Error while updating party object in database",
    "data": {MongoDB Error Object}
}`

**Удалить гостя**
----
  Запрос удаляет гостя из вечеринки

* **URL**

  /guest

* **Method:**

  `DELETE`
  
*  **URL Параметры**
 
    `pid: [string]`
    `guest_id: [integer]`

* **Body параметры**

     Нет

* **Success Response:**

  * **Content:** `{
    "isOK": true,
    "message": "Guest was deleted!",
    "data": {}
}`
 
* **Error Response:**
  
  * **Content:** `{
    "isOK": false,
    "message": "Error while trying to delete a guest from this party",
    "data": {MongoDB Error Object}
}`

  Или
  
  * **Content:** `{
    "isOK": false,
    "message": "No such guest to delete from this party",
    "data": {"guest_id": 123456}
}`

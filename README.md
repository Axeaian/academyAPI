# Academy Backend API

## Summary

This project is a simple backend API for teachers to use for administrative tasks related to students. Teachers and students are identified by their email addresses.

The available APIs allows:

1. Students to be registered
2. Retrieval of common students given list of teachers
3. Student to be suspended
4. Retrieval of students to be notified

<br />

## Running the server

If you wish to run the server, please follow the steps below.

1. After downloading the files, install dependencies by running
   `npm install`
2. If you have Docker, please proceed to step 3. Otherwise, you can install from https://www.docker.com/
3. Start Docker daemon
4. To start server on docker, run
   `docker compose up -d`
5. The api should be available to use at http://localhost:3002

<br />

## Details

### 1. As a teacher, I want to register one or more students to a specified teacher.

A teacher can register multiple students. A student can also be registered to multiple teachers.

- Endpoint: POST /api/register
- Headers: Content-Type: application/json
- Success response status: HTTP 204

```
// Request body example
{
    "teacher": "teacherken@gmail.com",
    "students": ["studentjon@gmail.com", "studenthon@gmail.com"]
}
```

</br>

### 2. As a teacher, I want to retrieve a list of students common to a given list of teachers (i.e. retrieve students who are registered to ALL of the given teachers).

- Endpoint: GET /api/commonstudents
- Success response status: HTTP 200

```
// Example 1: GET /api/commonstudents?teacher=teacherken%40gmail.com
// Success response:
{
    "students" :[
        "commonstudent1@gmail.com",
        "commonstudent2@gmail.com", "student_only_under_teacher_ken@gmail.com"
    ]
}
```

```
// Example 2: GET /api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40g mail.com
//Success response:
{
    "students" :[
        "commonstudent1@gmail.com",
        "commonstudent2@gmail.com"
    ]
}
```

<br/>

### 3. As a teacher, I want to suspend a specified student.

- Endpoint: POST /api/suspend
- Headers: Content-Type: application/json
- Success response status: HTTP 204

```
//Request body example:
{
    "student" : "studentmary@gmail.com"
}
```

<br/>

### 4. As a teacher, I want to retrieve a list of students who can receive a given notification.

A notification consists of:

- the teacher who is sending the notification, and
- the text of the notification itself.

To receive notifications from e.g. 'teacherken@gmail.com', a student:

- MUST NOT be suspended,
- AND MUST fulfill AT LEAST ONE of the following: 1. is registered with “teacherken@gmail.com" 2. has been @mentioned in the notification
  The list of students retrieved should not contain any duplicates/repetitions.

Examples:

- Endpoint: POST /api/retrievefornotifications
- Headers: Content-Type: application/json
- Success response status: HTTP 200

```
// Request Example 1
{
    "teacher": "teacherken@gmail.com",
    "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
}
// Response
{
    "recipients":[
        "studentbob@gmail.com", "studentagnes@gmail.com", "studentmiche@gmail.com"
    ]
}
```

In the example above, studentagnes@gmail.com and studentmiche@gmail.com can receive the notification from teacherken@gmail.com, regardless whether they are registered to him, because they are @mentioned in the notification text. studentbob@gmail.com however, has to be registered to teacherken@gmail.com.

```
// Request Example 2
{
    "teacher": "teacherken@gmail.com",
    "notification": "Hey everybody"
}

// Response
{ "recipients":[ "studentbob@gmail.com" ]}
```

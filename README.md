Problem Statement: Design teams in creative agencies or organizations find it difficult to
track the performance of their designs. They lack the ability to gather data on how their
designs are perceived by users or clients and have no clear insights into what aspects of a
design work well or need improvement. A tool is required to analyze design feedback, track
performance metrics, and provide actionable insights, helping teams refine their design
process based on data-driven decisions.

This is my Capstone Project .
Ill be developing this project using :
nodejs with typescript for backend and react with typescript for frontend .
https://www.figma.com/design/KDdZ1mnl9jFzzxP07l4WkU/Untitled?node-id=14-2&t=sLEKlSFJA3NTDcgb-1

entity "User" {
    +userId: integer <<PK>>
    +userName: varchar
    +email: varchar
    +password: varchar
    +roleId: integer
    +register()
    +login()
    +getFeedback()
} how do i create a user microservice of this using express nodejs with typescript , using mongodb as the database

https://medium.com/@induwara99/a-step-by-step-guide-to-setting-up-a-node-js-project-with-typescript-6df4481cb335



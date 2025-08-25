# Nudge-Mobile-App

Please Note: This Project is only about halfway finished. The documents below contain planning and iteration up untill a certain point. This documentation 
is likely to change in the near future.

## Project Summary:

This project is made up of two items. First, a mobile application that aims to help
people with Alzheimer's and Dementia and people with diagnoses such as ADHD and
Dyslexia. Second, a medical provider dashboard that doctors can use to directly add
prescriptions and tasks to their patients' profiles.

The dashboard allows the doctor to schedule appointments for their patients, set up
medications and their dosages, provide all the prescription details and provide details
on exercises or activities the user needs to do. They will be able to do this with a
patient’s unique application ID (generated when a user creates a profile). This
dashboard is still in the planning phase, as up until now, I was aiming to complete a
large portion of the mobile application first.

The mobile application allows users to create to-do lists (normal, timed and checklists),
store medication information, store information about the people in the user’s life,
access a calendar to schedule events, see the day’s weather and make emergency
calls. Many of these things will also be integrated, allowing the user to access different
aspects from different pages. This will mainly have to do with the calendar, where the
user will be able to see their timed lists, people’s birthdays and events. The application
will also send the user notifications when these events and lists need to be tended to.

## Style Guide and Wireframes for mobile app:

![Trebuchet Font](/assets/ReadMeImages/headerText.png)
![Roboto Font](/assets/ReadMeImages/bodyText.png)

**Font Choice:** 
Both Trebuchet MS and Roboto are Sans-Serif typeface fonts. Sans-Serif
fonts are fonts that have no extra bits added to the edges of the font (Tymoshchuk,
2021). And although, as Tymoshchuk (2021) states, most neurotypical people can’t
really find a difference in readability when reading sans-serif fonts and serif fonts (like
Times New Roman), for people who are neurodivergent and people who have poor
eyesight, sans-serif fonts are easier to read. Considering that the idea for this
application started with the aim to help people with Alzheimer’s and Dementia, and
people who live with these are often elderly, it is safe to assume that these fonts would
be easier to read. The use of these types of fonts for more accessible design is also
mentioned by Ghorbel et al. (2017) when talking about people with Alzheimer’s who
have poor eyesight, by Khan et al. (2018) for children with dyslexia and by Baxter (2025)
for people who live with ADHD.

![Trebuchet Font](/assets/ReadMeImages/light.png)
![Roboto Font](/assets/ReadMeImages/dark.png)

**Colour Schemes:** 
For now, I have decided to do only a light and dark colour scheme. I
focused on the contrast, but also made sure that the contrast is not too heavy. I still
wanted there to be enough contrast, so everything is easy to see, but with less contrast,
there is less eye strain. Khan et al. (2018) and Ghorbel et al. (2017) for Dyslexia and
Alzheimer’s, respectively, both mention avoiding very high contrast, stating that findings
show that less contrast can make reading and using the design easier and more
accessible.

**Outline:** 
I want to add a setting to the application that adds an outline to all the buttons
in the application in case the drop shadow is not enough. Thus, making the buttons
easier to see.

Along with the above-mentioned three authors, other articles I looked at that speak on
designing for Alzheimer’s, Dementia, ADHD and Dyslexia all said similar things. What it
comes down to:

- Simplistic design with no unnecessary distractions.
- No unnecessary actions to make accessing sections as easy as possible.
- Small sections of information.
- Logical file structure.
- Short, descriptive headings.
(Erikson, 2024; Design Whisperer, 2025; Williams, 2024)

When designing the wireframes for the application and deciding on fonts and colour
schemes, these are the things I was trying to keep in mind. The application design is
intentionally extremely simple, to avoid unnecessary clutter and distractions. A big goal
for this application is to help users get things done, which might be complicated if the
application was overly busy.

**Note on Gestures:**

In the initial design, there are a few gestures used, including press, press and hold, and
swipe. For the newest iteration, I want to remove the swipe and add a double tap. This is
to make the amount of movement as little as possible, in the case of someone having
mobility problems (Ghorbel et al., 2017). The tap motion is more minimal than swiping.
Thus, I want to implement these three gestures everywhere that it is needed to keep the
consistency intact and avoid long sweeping motions that might be harder to achieve.
Each use case will be explained below.

### Screenshots (Left) and Wireframes (Right):

![Splashscreen Current](/assets/ReadMeImages/startPageCur.png)
![Splashscreen Light](/assets/ReadMeImages/startPageNewL.png)
![Splashscreen Dark](/assets/ReadMeImages/startPageNewD.png)

**Splash Screen:** 
This is the page that the user will see when they open the application.
As shown above, the fonts will be changed to be more legible than the initial design.
This page will take the user to a page where they will either log in or create a new
account. If the user has already been logged in, the page will immediately go to the
Home Page.

![Pre-Home Current](/assets/ReadMeImages/preHomeCur.png)
![Pre-Home Light](/assets/ReadMeImages/preHomeNewL.png)
![Pre-Home Dark](/assets/ReadMeImages/preHomeNewD.png)

**Pre-Home Page:** 
From this page, the user will either log in or create a new account.

![Login Current](/assets/ReadMeImages/loginCur.png)
![Login Light](/assets/ReadMeImages/loginNewL.png)
![Login Dark](/assets/ReadMeImages/loginNewD.png)

**Log In Page:** 
Here, the user will log in with their email address and their password. They
are also able to access the “Create a New Account” page through the blue link at the
bottom of the page, should they need to.

![Create Account Current](/assets/ReadMeImages/createCur.png)
![Create Account Light](/assets/ReadMeImages/createNewL.png)
![Create Account Dark](/assets/ReadMeImages/createNewD.png)

**Create an Account Page:** 
Here, the user will be able to create a new account by
entering their name, email address and a password that consists of 8 characters, 1
number and 1 special character. The user will also be able to access the login page
through the blue link at the bottom of the page, should they need to.

![Home Current](/assets/ReadMeImages/homeCur.png)
![Home Light](/assets/ReadMeImages/homeNewL.png)
![Home Dark](/assets/ReadMeImages/homeNewD.png)

**Home Page:** 
The initial design was purely to show the buttons. The newest iteration will
have icons along with the labels to make it as easy as possible to access the section
you need. The user will be able to access any section of the application from the home
page. These include the settings (Top right) and each of the elements made accessible
by the application, like the diary logs, to-do lists, etc.

![To-do Current](/assets/ReadMeImages/listsCur.png)
![To-do Light](/assets/ReadMeImages/listsNewL.png)
![To-do Dark](/assets/ReadMeImages/listsNewD.png)

**To-Do Lists:** 
Here, all the user’s lists will be stored. When a list is created, the user can
press and hold the list item to change its type from normal to timed to checklist and
back. Clicking on the list itself will take the user to the list where they can then directly
interact with its content.

![Adding List Current](/assets/ReadMeImages/createListsCur.png)
![Adding List Light](/assets/ReadMeImages/createListsNewL.png)
![Adding List Dark](/assets/ReadMeImages/createListsNewD.png)

**Adding To-Do Lists:** 
When clicking on the plus icon in the top right, a box will then
appear that allows the user to name their list. Once they press “Done”, the list will then
be added to the user’s information and the list on this page. This functionality is the
same for all the lists, and the same functionality is used when the user edits an item.

![Normal List Current](/assets/ReadMeImages/normalListsCur.png)
![Normal List Light](/assets/ReadMeImages/normalListsNewL.png)
![Normal List Dark](/assets/ReadMeImages/normalListsNewD.png)

**Normal List:** 
When accessing a normal list, this is what the user will be presented with.
In the first iteration, the user would need to swipe the item to the right to access the
delete button and swipe it to the right to access the edit button. I plan on changing this,
as shown in the wireframes below. Furthermore, when completing an item, the user
needs to press and hold the item for it to be struck through and register as completed in
the user’s information.

![Actions Light](/assets/ReadMeImages/listActionsNewL.png)
![Actions Dark](/assets/ReadMeImages/listActionsNewD.png)

(No current iteration, only wireframes)

**Double-tap for Extra Options:** 
Moving forward, the user will double-tap the item to be
provided with extra options like delete and edit. This is to keep movement minimal. This
will be implemented anywhere where there are list- or log items that the user can
interact with, to keep it consistent throughout the application.

![Timed List Current](/assets/ReadMeImages/timedListsCur.png)
![Timed List Light](/assets/ReadMeImages/timedListsNewL.png)
![Timed List Dark](/assets/ReadMeImages/timedListsNewD.png)

**Timed List:** 
This list is a little more complicated. The user can add a start and end time
at the top to determine a timespan they will be working in. They can then add list items
(in the same manner as you do in the normal list). After changing the amount of time
they want to spend on each item by clicking on the minutes in the middle of the list
item, they can update the list, where the list will then calculate when the task should be
started and completed. This can be updated when items are deleted and added. I plan
on possibly adding an “auto” functionality that divides the time spent on each item
based on its priority. If an item is overdue, the list item turns red. If a list item is outside
of the timespan, the item turns orange.

![Checklist Light](/assets/ReadMeImages/checkListsNewL.png)
![Checklist Dark](/assets/ReadMeImages/checkListsNewD.png)

(No current iteration, only wireframes)

**Checklist:** 
A possible new addition. The functionality will be the same as the normal
list; however, the aim is a bit different. This is more useful for things like grocery lists.
The biggest difference is the check marks on the side.

![Diary list Current](/assets/ReadMeImages/diaryLogsCur.png)
![Diary list Light](/assets/ReadMeImages/diaryLogsNewL.png)
![Diary List Dark](/assets/ReadMeImages/diaryLogsNewD.png)

**Diary logs:** 
These store information much like a note application. These tiles show the
entry name, which can be edited, the date it was created and a preview of the note
contained within.

![Diary log Current](/assets/ReadMeImages/diaryEntryCur.png)
![Diary log Light](/assets/ReadMeImages/diaryEntryNewL.png)
![Diary log Dark](/assets/ReadMeImages/diaryEntryNewD.png)

**Diary Log Content:** 
The diary logs currently only hold text, but I plan on adding
functionality to add images and voice recordings as well, for people who find typing
hard. This will make it accessible to a wider range of people.

![People list Current](/assets/ReadMeImages/peopleLogsCur.png)
![People list Light](/assets/ReadMeImages/peopleLogsNewL.png)
![People list Dark](/assets/ReadMeImages/peopleLogsNewD.png)

**People Logs:** 
Here, the people in the user’s life can be stored. These will store each
person’s information. On this page, their name and relationship to the user will be
showcased. When clicked on, the user can access and edit more information.

![Adding people Current](/assets/ReadMeImages/addPeopleCur.png)
![Adding people Light](/assets/ReadMeImages/addPeopleNewL.png)
![Adding people Dark](/assets/ReadMeImages/addPeopleNewD.png)

**Adding People:** 
Initially, adding a person will only require their name and their
relationship to the user. The user will be able to edit the content when accessing it
separately.

![People log Current](/assets/ReadMeImages/personLogCur.png)
![People log Light](/assets/ReadMeImages/personLogNewL.png)
![People log Dark](/assets/ReadMeImages/personLogNewD.png)

**Person Log:** 
Here, the user will be able to access and edit the information of the person
recorded. It showcases their birthday, number, likes, dislikes, notes, name and
relationship. The user will also be able to add a picture of the person.

![Medication list Current](/assets/ReadMeImages/medicineCur.png)
![Medication list Light](/assets/ReadMeImages/medicineNewL.png)
![Medication list Dark](/assets/ReadMeImages/medicineNewD.png)

**Medication Logs:** 
Here, the user’s medication will be stored. These tiles will showcase
an image of the medicine, its name, dosage, when the medicine should next be fetched
(the button to indicate that it was fetched will only appear on the relevant date), and
when the next dose is due. The completion buttons can be clicked to indicate that the
dosage was taken. This is reset on the next day that a dose needs to be taken.

![Adding meds Current](/assets/ReadMeImages/addMedicineCur.png)
![Adding meds Light](/assets/ReadMeImages/addMedicineNewL.png)
![Adding meds Dark](/assets/ReadMeImages/addMedicineNewD.png)

**Adding Medication:** 
Here, all the relevant information is added so all the relevant
calculations can be made. The user adds the name, dosage, how many times the
medication needs to be repeated, when the medicine was first fetched, how often it
needs to be fetched, when the first dose was taken, how often the medicine needs to be
taken and every time a dose needs to be taken. This does look complicated; however,
this is more meant for the caretakers to add all the logs.

![Calendar Light](/assets/ReadMeImages/calendarNewL.png)
![Calendar Dark](/assets/ReadMeImages/calendarNewD.png)

(No current iteration, only wireframes)

**Calendar:** 
The calendar will hold all the events that the user must attend, including
appointments. These will hold other information like the time, place and duration. The
calendar will also display the weather of the selected day, along with recommended
clothing. The calendar will have access to other things like timed lists and the people
logs for birthdays. The calendar will show dots on any of the days that contain events
the user needs to know about.

![Adding event Light](/assets/ReadMeImages/addEventNewL.png)
![Adding event Dark](/assets/ReadMeImages/addEventNewD.png)

(No current iteration, only wireframes)

**Adding Calendar Events:** 
Events and appointments can be added by adding the event
name, place, time and duration of the event. This will then be stored in the calendar and
daily agenda.

![View Event Light](/assets/ReadMeImages/viewEventNewL.png)
![View Event Dark](/assets/ReadMeImages/viewEventNewD.png)

(No current iteration, only wireframes)

**View Event:** 
The user can view the event and its details by clicking on it in the daily
agenda.

![Clock Light](/assets/ReadMeImages/clockNewL.png)
![Clock Dark](/assets/ReadMeImages/clockNewD.png)

(No current iteration, only wireframes)

**Clock:** 
(non-essential) I will possibly add a clock page where the user can use the timer
for doing a task for a certain time, as well as set up alarms, for any reminder they might
need.

![Emergency Light](/assets/ReadMeImages/emergencyNewL.png)
![Emergency Dark](/assets/ReadMeImages/emergencyNewD.png)

(No current iteration, only wireframes)

**Emergency:** On this page, the user would need to hold in the emergency call buttons for
a certain amount of time for them to call either their emergency contact or Emergency
services.

![Settings Light](/assets/ReadMeImages/settingsNewL.png)
![Settings Dark](/assets/ReadMeImages/settingsNewD.png)

(No current iteration, only wireframes)

**Settings:** 
Here, the user will be able to change the application visually as well as edit
the details of their account.

**Other Notes:**
I am looking to implement a function where a caregiver can prevent the user from
editing certain elements, like medicine, to prevent them from accidentally changing
important information.

## Goals:

I divided my goals for this project into two sections: personal and project goals. Over the
last few months, working on this project, I found that some of these goals needed more
specifics. Below, I will be specifying each goal further and discussing how I have or
haven’t worked towards these goals.

*Personal:*

1. Implementing Good UI/UX Practices:

**Define:** To give it a more specific Definition, this goal entails having industry-standard
UI/UX that follows the recommended guidelines. UI/UX that is accessible, inclusive,
responsive, easily understandable and implemented in a way that makes sense in code.

**Have I worked towards this:** The UI/UX currently implemented is not final. And
although I did do my best to implement the UI/UX in this way, I think there is a lot of
room for improvement. Styling works a little bit differently in React Native, so I have
needed to adjust. I am still learning how to implement it properly, and although I do not
think I have completely been able to achieve this yet, I am confident I will be able to at
least find a better way of implementing the styles than I have been thus far.

2. Implementing Good, Clean and Understandable Code:

**Define:** Implementing code that is easily understandable, clean, efficient and
consistent. The code uses the correct syntax. On a more personal note, am I able to
learn about new code on my own and implement it effectively.

**Have I worked towards this:** In a broad sense, yes. I truly attempted to create code that
is not unnecessarily convoluted. I will be honest in saying that I do think there are pieces
of code that can be streamlined, but as I have continued to create this application, I
have learned to do this more easily. I will be going back and adjusting the code to be
more streamlined. On the topic of whether I was able to learn new code? This is a
definite yes. Although React Native is very similar to ReactJS, it has many nuances, and I
had to go through quite a learning curve to get everything to work. I also plan on working
towards using a database in the future, which is a whole other challenge.

3. Staying Feedback Driven and Human First:

**Define:** Using testing and feedback to make positive changes to improve the project,
while making sure to properly discern between useful and non-useful feedback. Making
sure the application is made for people and always keeping them in mind.

**Have I worked towards this:** Partly yes. I always have the individuals who might use
this application in mind when I develop. However, I could not do testing on the
application yet. That is the next step after I have finished the last of the frontend for the
mobile application.

*Project:*

1. Intuitive UI/UX:

**Define:** UI/UX that is easy to understand and easy for new users to get used to. UI/UX
that is easy to interact with, with no unnecessary actions or interactions. UI/UX that is
consistent throughout the application.

**Have I worked towards this:** I have done my best; however, I did realise that the swiping
action might not be a right fit for the application, so I plan on changing it to a double tap
that provides more options. Furthermore, I have done my best to stay consistent with
the UI/UX; however, I did use this first iteration to test different methods of interacting
with the UI/UX to see which would work the best.

2. Accessibility:

**Define:** An application that is accessible to anyone who wishes to use it, and that
allows the user to personalise their experience to what best suits them.

**Have I worked towards this:** I have made decisions on how I will be implementing
personalisation through the wireframes shown above, although this still needs to be
implemented. When it comes to whether it is accessible to anyone who wishes to use it,
I would say yes. I am trying to make the application easy to understand and easy to use
so that anyone of any ability can use it.

3. Smooth Integration:

**Have I worked towards this:** I have not reached this part of the project yet, so I do not
have any comment on its definition yet.

4. Scalability:

**Define:** A scalable application that contains code that can be used to expand the
application.

**Have I worked towards this:** I have, albeit unintentionally. The elements I have chosen
for this application are inherently similar in the way they are set up, which helped me
set up many of the pages. But this has also allowed me to think of other components
that might be added; the checklist is a good example of this. The application is
inherently something you can add to, because it is meant to be an application that
people use for different reasons. There is a lot of expanding that can be done in the diary
and calendar sections, for example, if you want to optimise parts of it for students. This
application can be scaled to a much wider scope than I currently have it at. It is,
however, important that I go back and make sure that the code allows for this. There are
admittedly a few areas in the code that can be done in a better way.

## References:

Baxter, Y.A. (2025) ‘Designing for Neurodiversity: Creating ADHD-Friendly Digital
Publications’. Available at: https://digitalcommons.liberty.edu/masters/1297/
(Accessed: 28 July 2025).

Ghorbel, F., Metais, E., Ellouze, N., Hamdi, F. and Gargouri, F. (2017) “Towards
Accessibility Guidelines of Interaction and User Interface Design for Alzheimer’s
Disease Patients”. ACHI 2017. The Tenth International Conference on Advances in
Computer-Human Interactions, Mar 2017, Nice, France. pp.143-149

Khan, R., Oon, Y.B., Inam, M., Inam Ul Haq, M. and Hajarah, S. (2018). “Proposed user
interface design criteria for children with dyslexia”. International Journal of Engineering
and Technology. 7. 5253-5257. 10.14419/ijet.v7i4.25496.

Tymoshchuk, O. (2021) “Font Readability Research: Key Difference Between Serif Vs
Sans Serif Font”, Geniusee. 30 June. Available at: https://geniusee.com/single-
blog/font-readability-research-famous-designers-vs-scientists (Accessed: 28 July
2025).

Design Whisperer. (2025) ‘Neurodiverse by Design: UX Strategies for Inclusive Digital
Spaces’, Dtalks, 9 January. Available at: https://medium.com/dtalks/neurodiverse-by-
design-ux-strategies-for-inclusive-digital-spaces-f06aef12c95c (Accessed: 28 July
2025).

Williams, R. (2024) “Why is digital design important for someone affected by
dementia?” Alzheimer’s Society. 20 March. Available at:
https://www.alzheimers.org.uk/blog/how-design-website-someone-affected-dementia
(Accessed: 28 July 2025).

Erikson, M. (2024) “Embracing Neurodiversity in UX Design: Crafting Inclusive Digital
Environments”. UXmatters. 22 April. Available at:
https://www.alzheimers.org.uk/blog/how-design-website-someone-affected-dementia
(Accessed: 28 July 2025).
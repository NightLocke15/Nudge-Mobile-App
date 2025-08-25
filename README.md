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

![Splashscreen Current]()
![Splashscreen Light]()
![Splashscreen Dark]()

**Splash Screen:** 
This is the page that the user will see when they open the application.
As shown above, the fonts will be changed to be more legible than the initial design.
This page will take the user to a page where they will either log in or create a new
account. If the user has already been logged in, the page will immediately go to the
Home Page.

![Splashscreen Current]()
![Splashscreen Light]()
![Splashscreen Dark]()

**Pre-Home Page:** 
From this page, the user will either log in or create a new account.

![Splashscreen Current]()
![Splashscreen Light]()
![Splashscreen Dark]()

**Log In Page:** 
Here, the user will log in with their email address and their password. They
are also able to access the “Create a New Account” page through the blue link at the
bottom of the page, should they need to.

![Splashscreen Current]()
![Splashscreen Light]()
![Splashscreen Dark]()

**Create an Account Page:** 
Here, the user will be able to create a new account by
entering their name, email address and a password that consists of 8 characters, 1
number and 1 special character. The user will also be able to access the login page
through the blue link at the bottom of the page, should they need to.

![Splashscreen Current]()
![Splashscreen Light]()
![Splashscreen Dark]()

**Home Page:** 
The initial design was purely to show the buttons. The newest iteration will
have icons along with the labels to make it as easy as possible to access the section
you need. The user will be able to access any section of the application from the home
page. These include the settings (Top right) and each of the elements made accessible
by the application, like the diary logs, to-do lists, etc.

![Splashscreen Current]()
![Splashscreen Light]()
![Splashscreen Dark]()

**To-Do Lists:** 
Here, all the user’s lists will be stored. When a list is created, the user can
press and hold the list item to change its type from normal to timed to checklist and
back. Clicking on the list itself will take the user to the list where they can then directly
interact with its content.

![Splashscreen Current]()
![Splashscreen Light]()
![Splashscreen Dark]()

**Adding To-Do Lists:** 
When clicking on the plus icon in the top right, a box will then
appear that allows the user to name their list. Once they press “Done”, the list will then
be added to the user’s information and the list on this page. This functionality is the
same for all the lists, and the same functionality is used when the user edits an item.

![Splashscreen Current]()
![Splashscreen Light]()
![Splashscreen Dark]()

**Normal List:** 
When accessing a normal list, this is what the user will be presented with.
In the first iteration, the user would need to swipe the item to the right to access the
delete button and swipe it to the right to access the edit button. I plan on changing this,
as shown in the wireframes below. Furthermore, when completing an item, the user
needs to press and hold the item for it to be struck through and register as completed in
the user’s information.

![Splashscreen Current]()
![Splashscreen Light]()

(No current iteration, only wireframes)

**Double-tap for Extra Options:** 
Moving forward, the user will double-tap the item to be
provided with extra options like delete and edit. This is to keep movement minimal. This
will be implemented anywhere where there are list- or log items that the user can
interact with, to keep it consistent throughout the application.

![Splashscreen Current]()
![Splashscreen Light]()
![Splashscreen Dark]()

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

![Splashscreen Current]()
![Splashscreen Light]()

(No current iteration, only wireframes)

**Checklist:** 
A possible new addition. The functionality will be the same as the normal
list; however, the aim is a bit different. This is more useful for things like grocery lists.
The biggest difference is the check marks on the side.

![Splashscreen Current]()
![Splashscreen Light]()
![Splashscreen Dark]()

**Diary logs:** 
These store information much like a note application. These tiles show the
entry name, which can be edited, the date it was created and a preview of the note
contained within.

![Splashscreen Current]()
![Splashscreen Light]()
![Splashscreen Dark]()

**Diary Log Content:** 
The diary logs currently only hold text, but I plan on adding
functionality to add images and voice recordings as well, for people who find typing
hard. This will make it accessible to a wider range of people.

![Splashscreen Current]()
![Splashscreen Light]()
![Splashscreen Dark]()

**People Logs:** 
Here, the people in the user’s life can be stored. These will store each
person’s information. On this page, their name and relationship to the user will be
showcased. When clicked on, the user can access and edit more information.

![Splashscreen Current]()
![Splashscreen Light]()
![Splashscreen Dark]()

**Adding People:** 
Initially, adding a person will only require their name and their
relationship to the user. The user will be able to edit the content when accessing it
separately.

![Splashscreen Current]()
![Splashscreen Light]()
![Splashscreen Dark]()

**Person Log:** 
Here, the user will be able to access and edit the information of the person
recorded. It showcases their birthday, number, likes, dislikes, notes, name and
relationship. The user will also be able to add a picture of the person.

![Splashscreen Current]()
![Splashscreen Light]()
![Splashscreen Dark]()

**Medication Logs:** 
Here, the user’s medication will be stored. These tiles will showcase
an image of the medicine, its name, dosage, when the medicine should next be fetched
(the button to indicate that it was fetched will only appear on the relevant date), and
when the next dose is due. The completion buttons can be clicked to indicate that the
dosage was taken. This is reset on the next day that a dose needs to be taken.

![Splashscreen Current]()
![Splashscreen Light]()
![Splashscreen Dark]()

**Adding Medication:** 
Here, all the relevant information is added so all the relevant
calculations can be made. The user adds the name, dosage, how many times the
medication needs to be repeated, when the medicine was first fetched, how often it
needs to be fetched, when the first dose was taken, how often the medicine needs to be
taken and every time a dose needs to be taken. This does look complicated; however,
this is more meant for the caretakers to add all the logs.

![Splashscreen Current]()
![Splashscreen Light]()

(No current iteration, only wireframes)

**Calendar:** 
The calendar will hold all the events that the user must attend, including
appointments. These will hold other information like the time, place and duration. The
calendar will also display the weather of the selected day, along with recommended
clothing. The calendar will have access to other things like timed lists and the people
logs for birthdays. The calendar will show dots on any of the days that contain events
the user needs to know about.

![Splashscreen Current]()
![Splashscreen Light]()

(No current iteration, only wireframes)

**Adding Calendar Events:** 
Events and appointments can be added by adding the event
name, place, time and duration of the event. This will then be stored in the calendar and
daily agenda.

![Splashscreen Current]()
![Splashscreen Light]()

(No current iteration, only wireframes)

**View Event:** 
The user can view the event and its details by clicking on it in the daily
agenda.

![Splashscreen Current]()
![Splashscreen Light]()

(No current iteration, only wireframes)

**Clock:** 
(non-essential) I will possibly add a clock page where the user can use the timer
for doing a task for a certain time, as well as set up alarms, for any reminder they might
need.

![Splashscreen Current]()
![Splashscreen Light]()

(No current iteration, only wireframes)

**Emergency:** On this page, the user would need to hold in the emergency call buttons for
a certain amount of time for them to call either their emergency contact or Emergency
services.

![Splashscreen Current]()
![Splashscreen Light]()

(No current iteration, only wireframes)

**Settings:** 
Here, the user will be able to change the application visually as well as edit
the details of their account.

**Other Notes:**
I am looking to implement a function where a caregiver can prevent the user from
editing certain elements, like medicine, to prevent them from accidentally changing
important information.


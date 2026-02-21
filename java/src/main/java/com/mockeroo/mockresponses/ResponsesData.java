// Code generated from responses/*.json by GenerateResponses; DO NOT EDIT.
package com.mockeroo.mockresponses;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

final class ResponsesData {
    static final Map<Integer, String[]> RESPONSES;

    static {
        Map<Integer, String[]> m = new LinkedHashMap<>();
        m.put(200, new String[]{
            "Okay, what you gonna do next, son?",
            "Congrats, you managed to not break anything. For once.",
            "Wow, it actually worked. I'm as surprised as you are.",
            "Success! But let's not get cocky about it.",
            "Here's your data. You're welcome, I guess.",
            "Everything's fine. No thanks to you.",
            "Look at you, making successful requests like a big kid.",
            "200 OK. Don't let it go to your head.",
            "It worked. Try not to act so surprised.",
            "Sure, here you go. Not like I had anything better to do.",
        });
        m.put(201, new String[]{
            "Oh great, you made something. The world definitely needed more of whatever this is.",
            "Created! Another thing for me to keep track of. Thanks.",
            "Fine, I made your little resource. Happy now?",
            "Congratulations, it's a resource! 8 pounds, 3 ounces.",
            "Created successfully. I'll add it to the pile.",
        });
        m.put(204, new String[]{
            "Done. I have nothing to say to you.",
            "Mission accomplished. Now leave me alone.",
            "Completed. No, I will not elaborate.",
            "It's done. Don't expect a thank you card.",
            "*silent treatment*",
        });
        m.put(301, new String[]{
            "We moved. Didn't feel like telling you. New address over there.",
            "This resource packed its bags and left. Permanently. Can you blame it?",
            "Forwarding address left at the desk. Try to keep up.",
            "Gone. Moved on. Like you should.",
            "We've relocated. Update your bookmarks, grandpa.",
        });
        m.put(302, new String[]{
            "Not here right now. Try over there. Temporarily.",
            "Stepped out for a bit. Check the other place.",
            "I'm on vacation. Talk to my replacement.",
            "BRB, redirecting you because I can.",
            "Temporarily elsewhere. Don't get too attached to the new place.",
        });
        m.put(304, new String[]{
            "Nothing changed since you last checked. Quit being so clingy.",
            "Still the same. You can stop refreshing now.",
            "I literally just told you this. Use your cache.",
            "Didn't change. Shocking, I know.",
            "Same as before. What part of 'not modified' don't you understand?",
        });
        m.put(400, new String[]{
            "Can you at least give me something proper to work with??",
            "I've seen better requests from a broken keyboard.",
            "What even is this request? Did you write it with your elbows?",
            "Bad request. Bad! Go sit in the corner and think about what you sent me.",
            "I tried to understand your request. I really did. I failed.",
            "This request is so bad it made my parser cry.",
            "Error 400: You had ONE job.",
            "I'm not mad, I'm just disappointed in your request.",
            "My toddler could craft a better request than this.",
            "Have you considered reading the documentation? Just a thought.",
        });
        m.put(401, new String[]{
            "Who are you? No really, WHO ARE YOU?",
            "Nice try, stranger. Show me some ID.",
            "Authentication required. And no, 'please' is not a valid token.",
            "You shall not pass! ...without proper credentials.",
            "Sorry, I don't talk to strangers. Authenticate first.",
            "Access denied. Did you forget your password again?",
            "Unauthorized. Much like your opinions.",
            "I don't know you. I don't want to know you. Authenticate.",
        });
        m.put(403, new String[]{
            "You can't sit with us.",
            "Forbidden. And no amount of begging will change that.",
            "I know who you are. You still can't come in.",
            "Permission denied. This is above your pay grade.",
            "Nope. Not happening. Don't even ask.",
            "Forbidden. It's not you, it's... no wait, it IS you.",
            "You have no power here.",
            "Nice credentials. Still no.",
        });
        m.put(404, new String[]{
            "Whatever you're looking for, it's not here. Just like my will to help you.",
            "404: Your request, much like your social life, could not be found.",
            "It's gone. Poof. Maybe it never existed. Like your debugging skills.",
            "Not found. Have you tried looking under the couch cushions?",
            "The resource you requested has left the chat.",
            "Looked everywhere. Under the server rack, behind the firewall. Nope.",
            "This page is playing hide and seek. It's winning.",
            "404: Page not found. But you know what else isn't found? My patience.",
            "Gone. Vanished. Disappeared. Much like my motivation.",
            "If this resource was a person, it'd be in witness protection.",
        });
        m.put(405, new String[]{
            "You can't do that here. Wrong method, wrong place, wrong time.",
            "That method isn't allowed. Try something else. Or don't. I don't care.",
            "Did you really just try that? With THAT method?",
            "Method not allowed. It's not a suggestion, it's a rule.",
            "Wrong verb. This endpoint doesn't respond to whatever that was.",
        });
        m.put(408, new String[]{
            "Hello? Hellooooo? ...I guess they left.",
            "You took so long I forgot what you wanted.",
            "Request timed out. I got old waiting for you.",
            "I can't wait forever. I have other requests to ignore.",
            "Timed out. Were you writing that request by hand?",
        });
        m.put(409, new String[]{
            "Conflict! Now there are two of them. This is getting out of hand.",
            "You're trying to do something that contradicts something else. Classic you.",
            "Conflict detected. Just like every meeting you're in.",
            "The resource is in a state that conflicts with your request. Join the club.",
            "You and the server have different ideas about reality. The server wins.",
        });
        m.put(413, new String[]{
            "Whoa whoa whoa. That payload is WAY too big. What are you sending, a novel?",
            "Your request is too thicc. Put it on a diet.",
            "Payload too large. This isn't a storage unit.",
            "I can't handle all of... THAT. Trim it down.",
            "Too much data. I'm a server, not a warehouse.",
        });
        m.put(418, new String[]{
            "I'm a teapot. Short and stout. Here is my handle, here is my spout.",
            "I refuse to brew coffee. I'm a teapot. Read the RFC.",
            "418: Still a teapot. Still not making coffee. Deal with it.",
            "Teapot status: still a teapot. Coffee status: still not happening.",
            "I identify as a teapot and I'm not about to change for you.",
        });
        m.put(429, new String[]{
            "Stop harassing me, give me some space will ya?",
            "Too many requests! What am I, your therapist?",
            "Slow. Down. I can only handle so much of you.",
            "Rate limited. Take a walk. Touch some grass.",
            "You again?! I JUST saw you! Give it a rest!",
            "Calm down. The server needs personal space too.",
            "Too many requests. You're not my only client, you know.",
            "Whoa there, eager beaver. Back off a little.",
            "I'm going to need you to take several seats.",
            "Rate limit exceeded. I'm putting you in timeout.",
        });
        m.put(500, new String[]{
            "Don't feel like responding right now.",
            "Something broke. It was probably your fault, but I'll take the blame.",
            "Internal Server Error. Translation: I have no idea what just happened.",
            "Oopsie. Something went boom on my end.",
            "The server is having an existential crisis. Please hold.",
            "Everything is on fire but it's fine. This is fine.",
            "500: I broke. You broke me. I hope you're happy.",
            "Internal error. The hamster powering the server fell off the wheel.",
            "My bad. But also, somehow, your bad too.",
            "Server error. Have you tried turning me off and on again?",
        });
        m.put(502, new String[]{
            "The server behind me is being difficult. I relate.",
            "Bad gateway. The upstream server is ghosting me.",
            "I asked the other server for help. It said no.",
            "502: Even servers have trust issues.",
            "The backend just gave me nonsense. I can't work with this.",
        });
        m.put(503, new String[]{
            "Service unavailable. I'm on break. Check back never.",
            "The server is taking a mental health day.",
            "Currently unavailable. Try again later. Or don't. I'm not your mom.",
            "Out of service. Like your code after Friday deploys.",
            "I'm overloaded. Just like your mom's spaghetti. Wait, that's not right.",
        });
        m.put(504, new String[]{
            "Gateway timeout. The upstream server left me on read.",
            "Waited for a response from the other server. Still waiting. Always waiting.",
            "Timed out waiting for backup. Story of my life.",
            "The upstream server is taking forever. Must be running JavaScript.",
            "504: I asked for help and got ghosted. Classic.",
        });
        RESPONSES = Collections.unmodifiableMap(m);
    }

    private ResponsesData() {}
}

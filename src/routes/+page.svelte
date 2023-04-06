<script>
    // @ts-nocheck
    import { applyAction, deserialize } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import { browser } from "$app/environment";
    let isLoggedIn = false;
    let hasPlusOne = false;
    let guestType = "";
    if (browser) {
        let val = window.sessionStorage.getItem("isLoggedIn");
        if (val) {
            isLoggedIn = val == "true";
        }
        val = window.sessionStorage.getItem("hasPlusOne");
        if (val) {
            hasPlusOne = val == "true";
        }
        val = window.sessionStorage.getItem("guestType");
        if (val) {
            guestType = val;
        }
    }
    // @ts-ignore
    function sessionStore(field, value) {
        if (browser) window.sessionStorage.setItem(field, value);
    }

    async function login(event) {
        const data = new FormData(this);

        const response = await fetch(this.action, {
            method: "POST",
            body: data,
            headers: {
                "x-sveltekit-action": "true",
            },
        });

        /** @type {import('@sveltejs/kit').ActionResult} */
        const result = deserialize(await response.text());

        console.log(result);

        if (result.type === "success") {
            sessionStore("isLoggedIn", true);
            sessionStore("guestType", result.data.type);
            sessionStore("hasPlusOne", result.data.hasPlusOne);
            isLoggedIn = true;
            guestType = result.data.type;
            hasPlusOne = result.data.hasPlusOne;
            await invalidateAll();
        }
        //applyAction(result);
    }

    function logout() {
        sessionStore("isLoggedIn", null);
        sessionStore("guestType", null);
        sessionStore("hasPlusOne", null);
        isLoggedIn = false;
        guestType = "";
        hasPlusOne = false;
    }

    async function rsvp(event) {
        const data = new FormData(this);
        const response = await fetch(this.action, {
            method: "POST",
            body: data,
            headers: {
                "x-sveltekit-action": "true",
            },
        });
        /** @type {import('@sveltejs/kit').ActionResult} */
        const result = deserialize(await response.text());

        console.log(result);

        if (result.type === "success") {
            await invalidateAll();
        }
        applyAction(result);
    }

    /** @type {import('./$types').ActionData} */
    export let form;

    const oneDay = 24 * 60 * 60 * 1000;
    const weddingDay = new Date(2023, 8, 1);
    const today = new Date();
    const diffDays = Math.round(Math.abs((today - weddingDay) / oneDay));
</script>

{#if isLoggedIn}
    <button on:click={logout}>Click me to logout</button>
{/if}

{#if isLoggedIn}
    <div class="flex flex-col">
        <!-- NAV -->
        <div
            class="flex flex-row flex-auto flex-wrap justify-evenly max-w-xl mx-auto"
        >
            <a
                class="text-accent hover:text-accent-dark font-staatliches tracking-widest text-2xl px-6 py-4 hover:underline underline-offset-8 hover:translate-y-[-4px] transition-all duration-200"
                href="#When">When</a
            >
            <a
                class="text-accent hover:text-accent-dark font-staatliches tracking-widest text-2xl px-6 py-4 hover:underline underline-offset-8 hover:translate-y-[-4px] transition-all duration-200"
                href="#Where">Where</a
            >
            <a
                class="text-accent hover:text-accent-dark font-staatliches tracking-widest text-2xl px-6 py-4 hover:underline underline-offset-8 hover:translate-y-[-4px] transition-all duration-200"
                href="#Nearby">Nearby</a
            >
            <a
                class="text-accent hover:text-accent-dark font-staatliches tracking-widest text-2xl px-6 py-4 hover:underline underline-offset-8 hover:translate-y-[-4px] transition-all duration-200"
                href="#TheDay">The Day</a
            >
            <a
                class="text-accent hover:text-accent-dark font-staatliches tracking-widest text-2xl px-6 py-4 hover:underline underline-offset-8 hover:translate-y-[-4px] transition-all duration-200"
                href="#Food">Food</a
            >
            <a
                class="text-accent hover:text-accent-dark font-staatliches tracking-widest text-2xl px-6 py-4 hover:underline underline-offset-8 hover:translate-y-[-4px] transition-all duration-200"
                href="#RSVP">RSVP</a
            >
            <a
                class="text-accent hover:text-accent-dark font-staatliches tracking-widest text-2xl px-6 py-4 hover:underline underline-offset-8 hover:translate-y-[-4px] transition-all duration-200"
                href="#FAQ">FAQ</a
            >
        </div>
    </div>
{/if}

<div class="flex flex-col bg-cork-pattern bg-[#a4794d] shadow-md">
    <div
        class="flex flex-row flex-auto flex-wrap gap-x-12 py-16 container mx-auto"
    >
        <div
            class="basis-2 grow flex flex-col justify-center items-center gap-y-8"
        >
            <h1
                class="font-staatliches text-center text-4xl tracking-widest text-[#ffffffb3]"
            >
                The Wedding of
            </h1>
            <h1
                class="font-ms_madi text-center text-8xl text-[#3e3733] font-semibold"
            >
                Emilie & Liam
            </h1>
        </div>
    </div>

    {#if isLoggedIn}
        <!-- HERO -->
        <div
            class="flex flex-row flex-auto flex-wrap gap-x-12 pb-16 container mx-auto"
        >
            <div class="basis-0 grow flex justify-center items-center">
                <img
                    class="max-w-sm w-full rounded-3xl aspect-square object-cover rotate-6 shadow-md"
                    src="img/h1.jpg"
                    alt="Liam and Emilie smiling"
                />
            </div>
        </div>
    {:else}
        <div class="max-w-5xl mx-auto px-4 font-poppins pb-14">
            <form
                action="?/login"
                class="flex sm:flex-col flex-auto gap-x-2 gap-y-2 mx-auto items-baseline sm:items-center"
                on:submit|preventDefault={login}
            >
                <label
                    class="block text-[#ffffffb3] uppercase font-bold mb-2"
                    for="fullname"
                >
                    Password
                </label>
                <input
                    class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    name="password"
                    type="password"
                    placeholder=""
                />
                {#if form?.missing}
                    <p
                        class="bg-red-700 text-white px-2 py-1 rounded-md text-sm"
                    >
                        password missing
                    </p>
                {/if}
                {#if form?.incorrect}
                    <p
                        class="bg-red-700 text-white px-2 py-1 rounded-md text-sm"
                    >
                        password incorrect
                    </p>
                {/if}
                <button
                    class="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </div>
    {/if}
</div>
{#if isLoggedIn}
    <div class="max-w-5xl mx-auto px-4 font-poppins">
        <!-- WHEN -->
        <div id="When" class="flex flex-col py-8">
            <h1
                class="font-staatliches text-4xl font-bold text-center text-accent mb-8"
            >
                When
            </h1>
            <div class="flex flex-row flex-auto">
                <div
                    class="basis-0 grow flex flex-col gap-y-4 justify-center items-center"
                >
                    <h2>13:00 Tuesday 01 August</h2>
                    <a
                        href="event.ics"
                        class="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >Add to Calendar</a
                    >
                </div>
                <div class="basis-0 grow flex justify-center items-center">
                    <h2 class="font-ms_madi text-6xl">{diffDays} Days</h2>
                </div>
            </div>
        </div>

        <hr class="mt-4" />

        <!-- WHERE -->
        <div id="Where" class="flex flex-col py-8">
            <h1
                class="font-staatliches text-4xl font-bold text-center text-accent mb-8"
            >
                Where
            </h1>
            <div class="flex md:flex-row flex-col gap-y-8 gap-x-4 flex-auto">
                <div class="flex basis-0 grow justify-center items-center">
                    <img
                        class="aspect-video object-cover rounded-3xl h-96"
                        src="img/clockbarn_outside.jpg"
                        alt="Exterior of Clockbarn venue, showing a clock tower"
                    />
                </div>
                <div
                    class="basis-0 grow flex flex-col justify-center items-center font-poppins gap-y-4"
                >
                    <h2>
                        Clock Barn<br />Tufton Warren<br />Whitchurch<br />RG28
                        7RB
                    </h2>
                    <a
                        href="https://goo.gl/maps/ji2wj7tq7mRAuJ7DA"
                        class="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >Get Directions</a
                    >
                </div>
            </div>
        </div>

        <hr class="mt-4" />

        <!-- Nearby -->
        <div id="Nearby" class="flex flex-col py-8">
            <h1
                class="font-staatliches text-4xl font-bold text-center text-accent mb-8"
            >
                Nearby
            </h1>
            <p class="font-poppins mb-4">
                The evening before the wedding we'll be staying at Norton Park
                and would love to meet you for a drink if you're staying nearby.
            </p>
            <div class="flex md:flex-row flex-col gap-y-8 gap-x-4 flex-auto">
                <div class="flex basis-0 grow justify-center items-center">
                    <img
                        class="aspect-square object-cover rounded-3xl h-96"
                        src="img/All.png"
                        alt="A map showing the location of nearby hotels"
                    />
                </div>
                <div
                    class="basis-0 grow flex flex-col items-stretch font-poppins gap-y-4"
                >
                    <div class="flex flex-col gap-y-4">
                        <h2 class="text-2xl md:text-start text-center">
                            Norton Park
                        </h2>
                        <p
                            class="bg-slate-200 rounded px-4 py-2 text-center block"
                        >
                            Use code <b>SOMECODE</b> when booking to get the wedding
                            party rate
                        </p>
                        <div
                            class="flex flex-row justify-center md:justify-start gap-x-4"
                        >
                            <a
                                href="https://www.nortonparkhotel.com/"
                                class="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >Website</a
                            >
                            <a
                                href="https://goo.gl/maps/epXtnPHujS56Mkia8"
                                class="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >Get Directions</a
                            >
                        </div>
                    </div>
                    <div class="flex grow flex-col gap-y-4">
                        <h2 class="text-2xl md:text-start text-center">
                            Travelodge
                        </h2>
                        <div
                            class="flex flex-row justify-center md:justify-start gap-x-4"
                        >
                            <a
                                href="https://www.travelodge.co.uk/hotels/74/Barton-Stacey-hotel"
                                class="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >Website</a
                            >
                            <a
                                href="https://goo.gl/maps/BKde6RLM8CiDewio6"
                                class="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >Get Directions</a
                            >
                        </div>
                    </div>
                    <div class="flex flex-col gap-y-4">
                        <h2 class="text-2xl md:text-start text-center">
                            DaysInn
                        </h2>
                        <div
                            class="flex flex-row justify-center md:justify-start gap-x-4"
                        >
                            <a
                                href="https://www.wyndhamhotels.com/en-uk/days-inn/winchester-united-kingdom/days-inn-sutton-scotney-north/overview?cid=PS:iqf55rbhqbwtf4r&gclid=Cj0KCQjwwtWgBhDhARIsAEMcxeDoNi7cVHdCqnpO5DXDLL3bxLT-4DU1kxAKzdUPHFzeM66wFRbUcsIaAmpmEALw_wcB&gclsrc=aw.ds"
                                class="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >Website</a
                            >
                            <a
                                href="https://goo.gl/maps/6Fapw9YmC3Jdrib46"
                                class="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >Get Directions</a
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <hr class="mt-4" />

        <!-- THE DAY -->
        <div id="TheDay" class="flex flex-col py-8">
            <h1
                class="font-staatliches text-4xl font-bold text-center text-accent mb-8"
            >
                The Day
            </h1>
            <div class="flex flex-col gap-y-4">
                <div class="flex flex-row flex-auto gap-x-8 items-center">
                    <h3 class="basis-0 grow text-end text-2xl">13:00</h3>
                    <h4 class="basis-0 grow text-start">Ceremony</h4>
                </div>
                <div class="flex flex-row flex-auto gap-x-8 items-center">
                    <h3 class="basis-0 grow text-end text-2xl">13:30</h3>
                    <h4 class="basis-0 grow text-start">Drinks Reception</h4>
                </div>
                <div class="flex flex-row flex-auto gap-x-8 items-center">
                    <h3 class="basis-0 grow text-end text-2xl">15:00</h3>
                    <h4 class="basis-0 grow text-start">Wedding Breakfast</h4>
                </div>
                <div class="flex flex-row flex-auto gap-x-8 items-center">
                    <h3 class="basis-0 grow text-end text-2xl">18:00</h3>
                    <h4 class="basis-0 grow text-start">Evening Reception</h4>
                </div>
                <div class="flex flex-row flex-auto gap-x-8 items-center">
                    <h3 class="basis-0 grow text-end text-2xl">23:30</h3>
                    <h4 class="basis-0 grow text-start">Carrages</h4>
                </div>
            </div>
        </div>

        <hr class="mt-4" />

        <!-- Food -->
        <div id="Food" class="flex flex-col py-8">
            <h1
                class="font-staatliches text-4xl font-bold text-center text-accent mb-8"
            >
                Food
            </h1>
            <div class="flex flex-col gap-y-8">
                <div
                    class="flex flex-col items-stretch justify-stretch md:flex-row flex-auto gap-y-4 gap-x-8 md:items-start"
                >
                    <h3 class="basis-0 grow text-center md:text-end text-2xl">
                        Canapé
                    </h3>
                    <div class="flex basis-0 grow flex-col gap-y-2">
                        <h4 class="basis-0 grow text-center md:text-start">
                            Sirloin, chips and Bearnaise sauce
                        </h4>
                        <h4 class="basis-0 grow text-center md:text-start">
                            Toad in the hole, onion relish
                        </h4>
                        <h4 class="basis-0 grow text-center md:text-start">
                            Tomato arancini, basil pesto <em class="text-sm"
                                >(Vegan)</em
                            >
                        </h4>
                        <hr class="hidden md:block mt-4" />
                    </div>
                </div>
                <div
                    class="flex flex-col items-stretch justify-stretch md:flex-row flex-auto gap-y-4 gap-x-8 md:items-start"
                >
                    <h3 class="basis-0 grow text-center md:text-end text-2xl">
                        Starter
                    </h3>
                    <div class="flex basis-0 grow flex-col gap-y-2">
                        <h4 class="basis-0 grow text-center md:text-start">
                            Chicken and ham hock, shallot and caper mayonnaise
                        </h4>
                        <h4 class="basis-0 grow text-center md:text-start">
                            <em>Vegetarian Option TBC</em>
                        </h4>
                        <hr class="hidden md:block mt-4" />
                    </div>
                </div>
                <div
                    class="flex flex-col items-stretch justify-stretch md:flex-row flex-auto gap-y-4 gap-x-8 md:items-start"
                >
                    <h3 class="basis-0 grow text-center md:text-end text-2xl">
                        Main
                    </h3>
                    <div class="flex basis-0 grow flex-col gap-y-2">
                        <h4 class="basis-0 grow text-center md:text-start">
                            Lamb rump, smoked garlic roasted baby carrots and
                            new potatoes, goat's curd and rosemary oil
                        </h4>
                        <h4 class="basis-0 grow text-center md:text-start">
                            <em>Vegetarian Option TBC</em>
                        </h4>
                        <hr class="hidden md:block mt-4" />
                    </div>
                </div>
                <div
                    class="flex flex-col items-stretch justify-stretch md:flex-row flex-auto gap-y-4 gap-x-8 md:items-start"
                >
                    <h3 class="basis-0 grow text-center md:text-end text-2xl">
                        Dessert
                    </h3>
                    <div class="flex basis-0 grow flex-col gap-y-2">
                        <h4 class="basis-0 grow text-center md:text-start">
                            White chocolate and raspberry crème brûlée
                        </h4>
                        <hr class="hidden md:block mt-4" />
                    </div>
                </div>
                <div
                    class="flex flex-col items-stretch justify-stretch md:flex-row flex-auto gap-y-4 gap-x-8 md:items-start"
                >
                    <h3 class="basis-0 grow text-center md:text-end text-2xl">
                        Evening
                    </h3>
                    <div class="flex basis-0 grow flex-col gap-y-2">
                        <h4 class="basis-0 grow text-center md:text-start">
                            Served With rolls, flat breads, pickles, mustards,
                            ketchup, mayonnaise and barbecue sauce
                        </h4>
                        <h4 class="basis-0 grow text-center md:text-start">
                            Beef burgers, flame grilled and served in brioche
                            buns
                        </h4>
                        <h4 class="basis-0 grow text-center md:text-start">
                            Grilled chicken kebabs, lemon and herb or sweet
                            chilli marinade
                        </h4>
                        <h4 class="basis-0 grow text-center md:text-start">
                            Cumberland sausage rings, pickled gherkins and sweet
                            mustard
                        </h4>
                    </div>
                </div>
            </div>
        </div>

        <hr />

        <!-- RSVP -->
        <div id="RSVP" class="flex flex-col py-8">
            <h1
                class="font-staatliches text-4xl font-bold text-center text-accent mb-8"
            >
                RSVP
            </h1>
            {#if form?.success}
            {#if form?.data.attending == 'yes'}
            <p class="text-center">Thanks for RSVPing {form?.data.fullname.split(" ",1)[0]}! We're looking forward to seeing you there! 💓</p>
            {:else}
            <p class="text-center">Thanks for RSVPing{form?.data.firstname}! We're sorry to hear we won't be seeing you! 😢</p>
            {/if}
            {:else}
            <p class="font-poppins text-center mb-8">
                Please RSVP by <b>Monday 15 May 2023</b>
            </p>
            <form
                class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 mx-auto"
                action="?/submit_rsvp"
                on:submit|preventDefault={rsvp}
            >
                <input type="submit" disabled style="display: none" aria-hidden="true" />
                <label
                    for="default-radio-1"
                    class="flex items-center gap-x-2 text-sm font-medium text-gray-900"
                >
                    <input
                        checked
                        id="default-radio-1"
                        type="radio"
                        value="yes"
                        name="attending"
                        class="w-4 h-4 bg-gray-100 border-gray-300"
                    />
                    I will be attending
                </label>
                <label
                    for="default-radio-2"
                    class="flex items-center gap-x-2 text-sm font-medium text-gray-900"
                >
                    <input
                        id="default-radio-2"
                        type="radio"
                        value="no"
                        name="attending"
                        class="w-4 h-4 bg-gray-100 border-gray-300"
                    />
                    I will not be attending
                </label>
                <label
                    class="block text-gray-700 text-sm font-bold mb-2"
                    for="fullname"
                >
                    Full Name
                    <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="fullname"
                        name="fullname"
                        type="text"
                        placeholder=""
                    />
                    {#if form?.missing && form?.field == "fullname"}
                        <p
                            class="bg-red-700 text-white text-sm rounded-sm px-2 py-1 mt-1 text-center"
                        >
                            Who are you?
                        </p>
                    {/if}
                </label>
                <label
                    class="block text-gray-700 text-sm font-bold mb-2"
                    for="email"
                >
                    Email Address
                    <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        name="email"
                        type="email"
                        placeholder=""
                    />
                    {#if form?.missing && form?.field == "email"}
                        <p
                            class="bg-red-700 text-white text-sm rounded-sm px-2 py-1 mt-1 text-center"
                        >
                           missing email address
                        </p>
                    {/if}
                </label>
                <label
                    class="block text-gray-700 text-sm font-bold mb-2"
                    for="phone"
                >
                    Phone Number
                    <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder=""
                    />
                    {#if form?.missing && form?.field == "phone"}
                        <p
                            class="bg-red-700 text-white text-sm rounded-sm px-2 py-1 mt-1 text-center"
                        >
                           missing phone number
                        </p>
                    {/if}
                </label>
                {#if hasPlusOne}
                <label
                    class="block text-gray-700 text-sm font-bold mb-2"
                    for="plusone"
                >
                    +1 Name
                    <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="plusone"
                        name="plusone"
                        type="text"
                        placeholder=""
                    />
                </label>
                {/if}
                <label
                    class="block text-gray-700 text-sm font-bold mb-2"
                    for="dietry"
                >
                    Dietry Requirements
                    <textarea
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        style="resize: none;"
                        id="dietry"
                        name="dietry"
                        rows="4"
                    />
                </label>
                <label
                    class="block text-gray-700 text-sm font-bold mb-2"
                    for="song_req"
                >
                    Song Requests
                    <textarea
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        style="resize: none;"
                        id="song_req"
                        name="song_req"
                        rows="4"
                    />
                </label>
                <button
                    class="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    Submit
                </button>
            </form>
            {/if}
        </div>

        <hr />

        <!-- FAQs -->
        <div id="FAQ" class="flex flex-col py-8">
            <h1
                class="font-staatliches text-4xl font-bold text-center text-accent mb-8"
            >
                FAQs
            </h1>
            <div class="flex flex-col gap-y-4">
                <div class="flex flex-col flex-auto gap-y-2 items-center">
                    <h3 class="basis-0 grow text-end text-2xl">
                        What time should I arrive?
                    </h3>
                    <h4 class="basis-0 grow text-start">
                        Those attending the whole day should aim to arrive by <b
                            >XX:00</b
                        >. We would ask our evening guests to arrive around
                        <b>19:00</b>.
                    </h4>
                </div>
                <div class="flex flex-col flex-auto gap-y-2 items-center">
                    <h3 class="basis-0 grow text-end text-2xl">
                        Is there parking?
                    </h3>
                    <h4 class="basis-0 grow text-start">
                        Yes Clockbarn have ample space for all guests to park in
                        their car park. You are welcome to leave cars overnight
                        but they do need to be collected the following morning
                        between 8am and 11am.
                    </h4>
                </div>
                <div class="flex flex-col flex-auto gap-y-2 items-center">
                    <h3 class="basis-0 grow text-end text-2xl">
                        What's the dress code?
                    </h3>
                    <h4 class="basis-0 grow text-start">
                        Smart-casual, semi-formal, no jeans!
                    </h4>
                </div>
                <div class="flex flex-col flex-auto gap-y-2 items-center">
                    <h3 class="basis-0 grow text-end text-2xl">
                        Can I bring my children?
                    </h3>
                    <h4 class="basis-0 grow text-start">
                        To allow all of our guests the chance to let their hair
                        down, this is an adults-only celebration.
                    </h4>
                </div>
                <div class="flex flex-col flex-auto gap-y-2 items-center">
                    <h3 class="basis-0 grow text-end text-2xl">
                        What can I get you as a gift?
                    </h3>
                    <h4 class="basis-0 grow text-start">
                        Your presence at our wedding is the best gift we could
                        receive.<br />
                        But for those who feel they would like to contribute, we
                        would be grateful for donations towards our honeymoon so
                        we can truly make it a once in a lifetime trip.
                    </h4>
                </div>
                <div class="flex flex-col flex-auto gap-y-2 items-center">
                    <h3 class="basis-0 grow text-end text-2xl">
                        Is it a free bar?
                    </h3>
                    <h4 class="basis-0 grow text-start">
                        No! It's a cashless bar, but sadly that doesnt mean
                        free. The bar only accepts cards.
                    </h4>
                </div>
            </div>
        </div>
    </div>
{/if}

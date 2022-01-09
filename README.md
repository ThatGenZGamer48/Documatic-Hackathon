# Documatic-Hackathon

The repository for working on the Hackathon hosted by the Documatic team.

# Directions of Use

- First open pgAdmin 4 and create a new database named DocumaticTest.
- Then create a table named UserDetails with columns of userId: text, inventoryItems: text[], coins: bigint, latestRedeemedTime: time with timezone, createdAt: date, updatedAt: date.
- Then create a table named UserDetails with columns of userId: text, inventoryItems: text[], coins: bigint, latestRedeemedTime: timestamp without timezone, createdAt: date, updatedAt: date.
- Then you can change the sequelizeConfig.js to include your credentials.
- Run the bot and you are good to go!

## Objective of the game

You are a vaccine researcher and you have come to the state of Monto, to research vaccines for three earth-shaking viruses happening in the city. Research and craft all the three vaccines, to become the "Vaccine Researcher".

## Steps to play the game

- Use the /project start command to start a new project. You will be assigned a random virus and a thousand coins to spend in the future. (Note: You cannot work on multiple projects at a time).
- Use the /inventory command throughout the course of the game, to know what items are there in your inventory and also the number of coins you have. You can use this to check if you have the required ingredients and virus to craft the vaccine.
- Then use the /redeem command to get a random number of coins between hundred and a thousand. You can use this command how many ever times you want, but only once every twenty minutes. So use your coins carefully.
- Proceed to use the /vaccines command to know which vaccine you can craft with your assigned virus. Also, note down the ingredients and the ID of the vaccine you are about to craft as it would be helpful later.
- Use the /shop command to note down the cost and the unique ID number of each of the ingredients required for the vaccine. (Note: Only buy the ingredients required for the vaccine you're crafting.)
- To buy the ingredients, use the /buy command and pass the ID of the ingredient you want to buy. The ingredient will be added to your inventory provided you have enough amount of coins. (Note: Go to bullet number 3, to replenish your coins once you run out of it).
- Once you have the required ingredients and the virus for the vaccine you're going to craft, use the /craft command to craft the vaccine. You will be given the vaccine, but the ingredients and the virus you had, will be removed from your inventory.
- Use the /project start command again, to get a new virus (that you have not crafted with before). Repeat the process until you finish crafting all the three vaccines available in the game.
- Once you get hold of all the three vaccines, use the /gettoken command to get a "Vaccine Researcher Token". The three vaccines will be removed from your inventory, and you will be granted this special token. You can get a token every time you craft all the three vaccines.
- The more tokens you acquire, the better researcher you are. Use the /tokens command to view the amount of tokens you have acquired.

**Hope you understood how the game works... Happy researching!**

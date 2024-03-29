module.exports = {
	name: 'igprofile',
	description: "fetch an instagram profile's informations",
	category: 'Utility',
	execute: async (message, info) => {
		let profile = await (
			await fetch(
				`https://i.instagram.com/api/v1/users/web_profile_info/?username=${info.args[0]}`,
				{
					headers: {
						'User-Agent': 'Instagram 219.0.0.12.117 Android',
						'Sec-Fetch-Site': 'same-origin',
					},
				}
			)
		).json()

		let userdata = {
			username: profile.data.user.username,
			name: profile.data.user.full_name,
			pronouns: profile.data.user.pronouns.toString().replace(',', '/'),
			followers: profile.data.user.edge_followed_by.count,
			following: profile.data.user.edge_follow.count,
			biography: profile.data.user.biography,
			website: profile.data.user.external_url,
			business: profile.data.user.is_business_account,
			private: profile.data.user.is_private,
			verified: profile.data.user.is_verified,
			profile_pic: profile.data.user.profile_pic_url_hd,
		}

		let {
			username,
			name,
			pronouns,
			followers,
			following,
			biography,
			website,
			business,
			private,
			verified,
			profile_pic,
		} = userdata

		message.reply(
			`*Username*: ${username}\n*Full Name*: ${name}\n*Pronouns*: ${pronouns}\n*Followers*: ${followers}\n*Following:* ${following}\n*Biography*: ${biography}\n*Website*: ${website}\n*Business*: ${business}\n*Verified*: ${verified}\n*Private*: ${private}\n*Profile Picture*: ${profile_pic}`
		)
	},
}

document.addEventListener("DOMContentLoaded", () => {
	async function main() {
		
		const res = await fetch("https://forum-proxy.freecodecamp.rocks/latest");
		const data = await res.json();
		let topics = data.topic_list.topics;
		let users = data.users;
		let id = 0;
		let activity = 0;
		let timeout;

		document.querySelector("table").innerHTML = `
			<tr id="headings">
				<th>#</th>
				<th>Topic</th>
				<th></th>
				<th>Replies</th>
				<th>Views</th>
				<th>Activity</th>
			</tr>
			<tr>
				<td id="hr-1"><hr /></td>
				<td id="hr-2"><hr /></td>
				<td id="hr-3"><hr /></td>
				<td id="hr-4"><hr /></td>
				<td id="hr-5"><hr /></td>
				<td id="hr-6"><hr /></td>
			</tr>
		`;

		topics = topics.sort((a, b) => new Date(b.last_posted_at).getTime() - new Date(a.last_posted_at).getTime());
		
		topics.forEach((item, index) => {
			id++;
			activity = ((new Date().getTime() - new Date(item.last_posted_at).getTime()) / 1000 / 60).toFixed();
			
			if(activity < 60) {
				activity += 'm';
			} else {
				activity = (activity / 60).toFixed();
				activity += 'h';
			}
			
			document.querySelector("table").innerHTML += `
				<tr id="tr-${index + 1}">
					<td class="center">${id}</td>
					<td><a href='#'>${item.title}</a></td>
					<td id="posters-${index + 1}"></td>
					<td class="center">${item.reply_count}</td>
					<td class="center">${item.views}</td>
					<td class="center">${activity}</td>
				</tr>
			`;
	
			item.posters.forEach((poster, index2) => {
				for(let i = 0; i < users.length; i++) {
					if(users[i].id === poster.user_id) {
						let avatar = users[i].avatar_template.replace("{size}", "144");

						if(avatar.includes("/user_avatar")) {
							avatar = avatar.replace("/user_avatar", "https://sea1.discourse-cdn.com/freecodecamp/user_avatar");
						}
						
						document.querySelector(`#posters-${index + 1}`).innerHTML += `<a href='#'><img alt="${users[i].username}" src="${avatar}" /></a>`;
					}
				}
			});
			
			if(index % 2 === 0) {
				document.querySelector(`#tr-${index + 1}`).style.backgroundColor = "#C8C8C8";
			} else {
				document.querySelector(`#tr-${index + 1}`).style.backgroundColor = "#E4E4E4";
			}
		});
		
		Array.from(document.querySelectorAll("table img")).forEach((image, index3) => {
			image.removeEventListener("mouseenter", imageEventListener);
			image.addEventListener("mouseenter", imageEventListener);
			image.removeEventListener("mouseleave", imageEventListenerLeave);
			image.addEventListener("mouseleave", imageEventListenerLeave);
							
			function imageEventListener(e) {
				document.querySelector("#username-display").style.display = "block";
				document.querySelector("#username-display").style.left = `${e.clientX}px`;
				document.querySelector("#username-display").style.top = `${e.clientY}px`;
								
				for(let i = 0; i < users.length; i++) {
					if(users[i].username === image.alt) {
						document.querySelector("#username-display").innerHTML = users[i].username;
					}
				}
			}
			function imageEventListenerLeave(e) {
				document.querySelector("#username-display").style.display = "none";
			}
		});
	}
	
	
	
	
	
	main();
});
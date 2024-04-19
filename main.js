( async  ()  => {
	const $ = document.querySelector.bind(document);
	let timeRotate = 7000; //7 giây
	let currentRotate = 0;
	let isRotating = false;
	const wheel = $('.wheel');
	const btnWheel = $('.btn--wheel');
	const btnCheckPhoneNumber = $('.btn--CheckPhoneNumber');
	const btnbackRound = $('.backRound');
	const showMsg = $('.msg');
//=====< Số lượng phần thưởng >=====
    const listGift = await prizeList()
	const size = listGift.length;

//=====< Số đo góc của 1 phần thưởng chiếm trên hình tròn >=====
	const rotate = 360 / size;

//=====< Số đo góc cần để tạo độ nghiêng, 90 độ trừ đi góc của 1 phần thưởng chiếm >=====
	const skewY = 90 - rotate;

	listGift.map((item, index) => {
		//=====< Tạo thẻ li >=====
		const elm = document.createElement('li');

		//=====< Xoay và tạo độ nghiêng cho các thẻ li >=====
		elm.style.transform = `rotate(${
			rotate * index
		}deg) skewY(-${skewY}deg)`;

		//=====< Thêm background-color so le nhau và căn giữa cho các thẻ text>=====
		if (index % 2 == 0) {
			elm.innerHTML = `<p style="transform: skewY(${skewY}deg) rotate(${
				rotate / 2
			}deg);" class="text text-1">
			<b>${item.name}</b>
		</p>`;
		} else {
			elm.innerHTML = `<p style="transform: skewY(${skewY}deg) rotate(${
				rotate / 2
			}deg);" class="text text-2">
		<b>${item.name}</b>
		</p>`;
		}

		//=====< Thêm vào thẻ ul >=====
		wheel.appendChild(elm);
	});

	/********** Hàm bắt đầu **********/
	const start = async () => {
		//=====< khoa nút nhấn lại trong lúc đang quay>=====
	    isRotating = true;
		showMsg.innerHTML = '';
		const phone = document.getElementById("phoneI").value;
		//=====< Gọi hàm lấy phần thưởng >=====
		const gift = await getGift() - 1;

		//=====< Số vòng quay: 360 độ = 1 vòng (Góc quay hiện tại) >=====
		currentRotate += 360 * 10;
		//=====< Gọi hàm quay >=====
		rotateWheel(currentRotate, gift);
        //=====< Gọi ham luu ket qua ve server >=====
		saveGift (phone,listGift[gift]) 
		//=====< Gọi hàm in ra màn hình >=====
		 showGift(listGift[gift]);

	};

	/********** Hàm quay vòng quay **********/
	const rotateWheel = (currentRotate, index) => {
		
		$('.wheel').style.transform = `rotate(${
			//=====< Góc quay hiện tại trừ góc của phần thưởng>=====
			//=====< Trừ tiếp cho một nửa góc của 1 phần thưởng để đưa mũi tên về chính giữa >=====
			currentRotate - index * rotate - rotate / 2
		}deg)`;
		
	};

	/********** Hàm lấy danh sách prize **********/
     async function prizeList() 
		{
			const apiUrl = 'https://outsourceapi.adcvn.com/api.rsc/prizelist?$orderby=id asc';
			//Define options for the fetch request
				const requestOptions = {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json', // Specify the content type as JSON
							'x-cdata-authtoken':'4h7U6f3n7F1n6f1G1q4a',
							'Access-Control-Allow-Origin':'*'
						} // Convert the data to JSON format
					};
				getprizeList= await fetch(apiUrl, requestOptions)
						.then(response => {
							if (!response.ok) {
							throw new Error('Network response was not ok');
							}
							return response.json(); // Parse the JSON response
						})
						.then(data => {
							// Handle the response data here
							return data.value
						})
						.catch(error => {
							// Handle any errors that occur during the fetch request
							console.error('Fetch error:', error);
						  	alert(error)
						  }

				)
			return getprizeList
		};
	/********** Hàm lấy phần thưởng **********/
	async function getGift() 
	 {

			const apiUrl = 'https://outsourceapi.adcvn.com/api.rsc/GetRewardLuckyRoundAction';
			//Define options for the fetch request
				const requestOptions = {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json', // Specify the content type as JSON
							'x-cdata-authtoken':'4h7U6f3n7F1n6f1G1q4a',
							'Access-Control-Allow-Origin':'*'
						} ,
						body:''
						// Convert the data to JSON format
					};
				gift  = await fetch(apiUrl, requestOptions)
						.then(response => {
							if (!response.ok) {
							throw new Error('Network response was not ok');
							}
							return response.json(); // Parse the JSON response
						})
						.then(data => {
							// Handle the response data here
							console.log(data.value)
							return data.value[0].rewardid
						})
						.catch(error => {
							// Handle any errors that occur during the fetch request
							console.error('Fetch error:', error);
						  	alert(error)
						  })
				
              return gift
	};
	/********** Hàm lưu phần thưởng **********/
function saveGift (phoneNumber,Gift) 
	 {
			const apiUrl = 'https://outsourceapi.adcvn.com/api.rsc/RewardRoundLuckyAction';
			// Define the data you want to send in the POST request
			const postData = {};
			postData["phonenumber"] = phoneNumber;
			postData["reward"] = Gift.name;
			postData["rewardid"] = Gift.id;
			//Define options for the fetch request
				const requestOptions = {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json', // Specify the content type as JSON
							'x-cdata-authtoken':'4h7U6f3n7F1n6f1G1q4a',
							'Access-Control-Allow-Origin':'*'
						},
						body:JSON.stringify(postData)
						// Convert the data to JSON format
					};
		 fetch(apiUrl, requestOptions)
						.then(response => {
							if (!response.ok) {
							throw new Error('Network response was not ok');
							}
							return response.json(); // Parse the JSON response
						})
						.then(data => {
							// Handle the response data here
							console.log(data.value)
							//return data.value[0].rewardid
						})
						.catch(error => {
							// Handle any errors that occur during the fetch request
							console.error('Fetch error:', error);
						  	alert(error)
						  })
				
              return gift
	};

	/********** In phần thưởng ra màn hình **********/
	const showGift = gift => {
		console.log(gift)
		let timer = setTimeout(() => {
			isRotating = false;
			if (gift.id == 4)
			{
				showMsg.innerHTML = `Chúc bạn "${gift.name}"`;
			
			}
			else
			{
				showMsg.innerHTML = `Chúc mừng bạn đã nhận được "${gift.name}"`;
			}
	     document.getElementById('main').style.display='none' ;
		 document.getElementById('main_overlay').style.transform='scale(1)' ;
		 document.getElementById('main_overlay').style.ransition='0.35s';
			clearTimeout(timer);
		}, timeRotate);
	};
     /********** Hàm lấy danh sách prize **********/
     async function prizeList() 
		{
			const apiUrl = 'https://outsourceapi.adcvn.com/api.rsc/prizelist?$orderby=id asc';
			//Define options for the fetch request
				const requestOptions = {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json', // Specify the content type as JSON
							'x-cdata-authtoken':'4h7U6f3n7F1n6f1G1q4a',
							'Access-Control-Allow-Origin':'*'
						} // Convert the data to JSON format
					};
				getprizeList= await fetch(apiUrl, requestOptions)
						.then(response => {
							if (!response.ok) {
							throw new Error('Network response was not ok');
							}
							return response.json(); // Parse the JSON response
						})
						.then(data => {
							// Handle the response data here
							return data.value
						})
						.catch(error => {
							// Handle any errors that occur during the fetch request
							console.error('Fetch error:', error);
						  	alert(error)
						  })
			return getprizeList
		};
	function checkPhonenumber()
				{
					//load andimation
					document.getElementById('loader').classList.remove('hidden');
					document.querySelector(".spin_form_p_checkphonenumber").innerHTML = 'Hệ thống đang kiểm tra....';
					document.querySelector(".spin_form_p_checkphonenumber").style.color="red";
					const phone = document.getElementById("phoneI").value;

						// Define the URL of the API endpoint
						const apiUrl = 'https://outsourceapi.adcvn.com/api.rsc/checkLuckyRound';
						// Define the data you want to send in the POST request
						const postData = {};
						postData["phonenumber"] = phone
						// Define options for the fetch request
						const requestOptions = {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json', // Specify the content type as JSON
							'x-cdata-authtoken':'4h7U6f3n7F1n6f1G1q4a',
							'Access-Control-Allow-Origin':'*'
							// Add any other headers as needed
						},
						body: JSON.stringify(postData) // Convert the data to JSON format
						};
                       console.log(requestOptions)
						// Make the POST request using Fetch API
						fetch(apiUrl, requestOptions)
							.then(response => {
							if (!response.ok) {
								throw new Error('Network response was not ok');
							}
							return response.json(); // Parse the JSON response
							})
							.then(data => {
							// Handle the response data here
							console.log('Response data:', data.value);
							const errCode = data.value[0].errorcode;
							const message = data.value[0].message;
							document.getElementById('loader').classList.add('hidden');
							if (errCode == 1)
							{
								document.querySelector(".spin_form_p_checkphonenumber").innerHTML = message;
								document.querySelector(".spin_form_p_checkphonenumber").style.color="red";
							}
							else
							{
								document.getElementById('loginLayout').style.opacity = 0; // Fade out login layout
								setTimeout(function() {
									document.getElementById('loginLayout').style.display = 'none'; // Hide login layout after fade out
									document.getElementById('homeLayout').style.display = 'flex'; // Show home layout
									setTimeout(function() {
										document.getElementById('homeLayout').style.opacity = 1; // Fade in home layout
									}, 50);
								}, 500); // Wait for fade out animation to complete
							}
							})
							.catch(error => {
							// Handle any errors that occur during the fetch request
								console.error('Fetch error:', error);
								alert(error)
							}); 
				}
	   function spinerBack()
				{
				console.log('dsadsad')
				  location.reload();
				}
	/********** Sự kiện click button start **********/
	btnWheel.addEventListener('click', () => {
		!isRotating && start();
	});
	/********** Sự kiện click button check phone **********/
	btnCheckPhoneNumber.addEventListener('click', () => {
		checkPhonenumber()
	});
  /********** QUay lai**********/
  btnbackRound.addEventListener('click', () => {
	spinerBack()
	});
})();

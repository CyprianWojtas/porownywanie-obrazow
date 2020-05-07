function dragOverHandler(e)
{
	e.preventDefault();
}
function dragEnterHandler(e)
{
	e.target.classList.add("przerzucanie");
}
function dragLeaveHandler(e)
{
	e.target.classList.remove("przerzucanie");
}
async function dropHandler(e)
{
	dragLeaveHandler(e);

	e.preventDefault();

	for(let plik of e.dataTransfer.files)
	{
		await new Promise(nastepny =>
		{
			let fr = new FileReader();
			fr.onload = function ()
			{
				let img = document.createElement("img");
				img.onload = nastepny;
				img.src = fr.result;
				document.body.append(img);
			}
			fr.readAsDataURL(plik);
		});
	}

	if (document.querySelectorAll("img").length >= 2)
	{
		let img = document.querySelectorAll("img");
		porownaj(img[0], img[1]);
	}
}


function porownaj(img1, img2)
{
	let c = document.createElement("canvas");
	let ctx = c.getContext("2d");

	document.body.append(c);

	c.width  = img1.width  > img2.width  ? img1.width  : img2.width;
	c.height = img1.height > img2.height ? img1.height : img2.height;

	ctx.drawImage(img1, (c.width - img1.width) / 2, (c.height - img1.height) / 2);
	let imgd1 = ctx.getImageData(0, 0, c.width, c.height);

	ctx.clearRect(0, 0, c.width, c.height);
	ctx.drawImage(img2, (c.width - img2.width) / 2, (c.height - img2.height) / 2);
	let imgd2 = ctx.getImageData(0, 0, c.width, c.height);

	let roznica = new ImageData(c.width, c.height);

	for (let x = 0; x < c.width;  x++)
	for (let y = 0; y < c.height; y++)
	{
		let i = (y * c.width + x) * 4;

		roznica.data[i    ] = 255 - Math.abs(imgd1.data[i    ] - imgd2.data[i    ]);
		roznica.data[i + 1] = 255 - Math.abs(imgd1.data[i + 1] - imgd2.data[i + 1]);
		roznica.data[i + 2] = 255 - Math.abs(imgd1.data[i + 2] - imgd2.data[i + 2]);

		roznica.data[i + 3] = 255;
	}

	ctx.putImageData(roznica, 0, 0);

	img1.style.height = "200px";
	img2.style.height = "200px";
	c.style.maxWidth = "100%";
}
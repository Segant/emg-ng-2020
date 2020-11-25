window.onload = () => {

	const Snow = (canvas, count, options) => {
		const ctx = canvas.getContext('2d')
		const snowflakes = []

		const add = item => snowflakes.push(item(canvas))

		const update = () => _.forEach(snowflakes, el => el.update())

		const resize = () => {
			ctx.canvas.width = canvas.offsetWidth
			ctx.canvas.height = canvas.offsetHeight

			_.forEach(snowflakes, el => el.resized())
		}

		const draw = () => {
			ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
			_.forEach(snowflakes, el => el.draw())
		}

		const events = () => {
			window.addEventListener('resize', resize)
		}

		const loop = () => {
			draw()
			update()
			animFrame(loop)
		}

		const init = () => {
			_.times(count, () => add(canvas => SnowItem(canvas, null, options)))
			events()
			loop()
		}

		init(count)
		resize()

		return { add, resize }
	}

	const defaultOptions = {
		color: 'orange',
		radius: [0.5, 3.0],
		speed: [1, 3],
		wind: [-0.5, 3.0]
	}

	const SnowItem = (canvas, drawFn = null, opts) => {
		const options = { ...defaultOptions, ...opts }
		const { radius, speed, wind, color } = options
		const params = {
			color,
			x: _.random(0, canvas.offsetWidth),
			y: _.random(-canvas.offsetHeight, 0),
			radius: _.random(...radius),
			speed: _.random(...speed),
			wind: _.random(...wind),
			isResized: false
		}
		const ctx = canvas.getContext('2d')

		const updateData = () => {
			params.x = _.random(0, canvas.offsetWidth)
			params.y = _.random(-canvas.offsetHeight, 0)
		}

		const resized = () => params.isResized = true

		const drawDefault = () => {
			ctx.beginPath()
			ctx.arc(params.x, params.y, params.radius, 0, 2 * Math.PI)
			ctx.fillStyle = params.color
			ctx.fill()
			ctx.closePath()
		}

		const draw = drawFn
			? () => drawFn(ctx, params)
			: drawDefault

		const translate = () => {
			params.y += params.speed
			params.x += params.wind
		}

		const onDown = () => {
			if (params.y < canvas.offsetHeight) return

			if (params.isResized) {
				updateData()
				params.isResized = false
			} else {
				params.y = 0
				params.x = _.random(0, canvas.offsetWidth)
			}
		}

		const update = () => {
			translate()
			onDown()
		}

		return {
			update,
			resized,
			draw
		}
	}

	const canvas = document.getElementById('snow')

	const animFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame

	  Snow(canvas, 150, { color: 'white' });


	class Spin {
		constructor(params) {
			this.root = params.root || `.spin`;
			this.btn = params.btn || 'spin-btn';
			this.activeClass = params.activeClass || 'active';
			this.itemsHeight = params.itemsHeight || '20';
			this.btnCallback = params.btnCallback;

			this.setup();
		}

		setup() {
			const root = document.querySelector(`${this.root}`);
			const btn = document.querySelectorAll(`${this.btn}`);
			const items = document.querySelectorAll(`.spin-item`);
			const spinnerBody = document.querySelector(`.spin__body`);
			const spinnerView = document.querySelector(`.spin__view`);
			
			items.forEach((item, i) => {
				item.style.height = `${this.itemsHeight}px`
			});
			
			const itemsHeight = items[0].offsetHeight;
			const spinViewHeight = itemsHeight;
			spinnerView.style.height = `${itemsHeight}px`;
			
			const btnFunc = () => {
				items.forEach((item, i) => {
					item.classList.remove(this.activeClass)
				});

				const randomNum = Math.floor(Math.random() * items.length)
				items[randomNum].classList.add(this.activeClass);
				spinnerBody.style.transform = `translateY(-${itemsHeight * randomNum}px)`;

				items[randomNum].classList.add('spinned')

				this.btnCallback();
			}


			btn.forEach((el, i) => {
				el.addEventListener('click', btnFunc);
			})

			
		}
	}

	setTimeout(function(){
		$('.main--loader').fadeOut();
		gsap.to(".main--bull", {opacity: 1});
	}, 1000)

	
	
	$('.spin-item__text').hide();
	$('.main__text, .main__btns , .main__btns-res').hide();

	$('.sub__btn').click(function (e) {
		$('.main--bull').addClass('main--spin');
		$('.main__text, .main__btns').show();
		gsap.to(".sub", {opacity: 0});
	});

	if(document.querySelector(`.spin`)){
		new Spin({
			root: '.spin',
			btn: '.spin-btn',
			itemsHeight : '100',
			btnCallback: function(){
				$('.main__text , .main__btns').fadeOut();

				if($(window).width() < 1024){
					gsap.to(".bull", {
						// backgroundImage:'url(../img/bull_horn.svg)',
						y: -20,
						scale:"1.5",
						duration: 2,
						onComplete: showContent,
					});

					return
				}
				
				gsap.to(".bull", {
					// backgroundImage:'url(../img/bull_horn.svg)',
					y: 40,
					scale:"1.2",
					duration: 2,
					onComplete: showContent,
				});
				
			}
		})
	}

	function showContent(){
		$('.main--bull .main__title').html('А вот и твой <br> подарок!');
		$('.main__text-res , .main__btns-res').fadeIn();
	}

	$('.btnGetGift').click(function(e){
		e.preventDefault();
		$('.main--bull').fadeOut();
		gsap.to(".main--gift", {opacity: 1});
	})



};
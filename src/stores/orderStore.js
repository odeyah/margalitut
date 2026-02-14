import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { createOrder, checkCouponUsage, saveCouponUsage } from '../services/ordersService';
import { sendOrderEmail } from '../services/emailService';
import { useToastStore } from './toastStore';

export const useOrderStore = defineStore('order', () => {
	// ===== STATE =====
	// טעינת עגלה מ-localStorage
	function loadCartFromStorage() {
		try {
			const saved = localStorage.getItem('margalitot_cart');
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
	}

	// שמירת עגלה ל-localStorage
	function saveCartToStorage(cartData) {
		try {
			localStorage.setItem('margalitot_cart', JSON.stringify(cartData));
		} catch (error) {
			console.error('Failed to save cart:', error);
		}
	}

	const cart = ref(loadCartFromStorage());
	// ===== COUPONS =====
	const appliedCoupon = ref(null);
	const couponError = ref('');
	const couponSuccess = ref('');

	const availableCoupons = ref([
		{
		    code: 'TASTING5',
    		type: 'percent',
    		value: 5,
		    minOrder: 40,
		    description: '5% הנחה למשתתפי יריד הטעימות',
		    active: true,
		    expiresAt: new Date('2025-02-19T20:00:00'), // יום רביעי 20:00
		},
		{
			code: 'WELCOME10',
			type: 'percent', // percent או fixed
			value: 10,
			minOrder: 50,
			description: '10% הנחה על ההזמנה הראשונה',
			active: true,
		},
		{
			code: 'SWEET20',
			type: 'fixed',
			value: 20,
			minOrder: 100,
			description: '₪20 הנחה בהזמנה מעל ₪100',
			active: true,
		},
		{
			code: 'FAMILY10',
			type: 'percent',
			value: 10,
			minOrder: 200,
			description: '10% הנחה בהזמנה מעל ₪200',
			active: true,
		},
		{
			code: 'FREEDELIVERY',
			type: 'freeDelivery',
			value: 0,
			minOrder: 250,
			description: 'משלוח חינם בהזמנה מעל ₪250',
			active: true,
		},
	]);
	const customerInfo = ref({
		name: '',
		phone: '',
		email: '',
		address: '',
		city: '',
	});
	const orderDate = ref('');
	const orderTime = ref('');
	const specialRequests = ref('');
	const orderHistory = ref([]);
	const isLoading = ref(false);
	const currentStep = ref(1);
	const lastOrder = ref(null);

	// ===== DELIVERY OPTIONS =====
	const deliveryOption = ref('pickup');
	const selectedLocation = ref('');

	const locations = ref([
		// אזור 1 - ₪20
		{ id: 'hamishkafayim', name: 'המשקפיים', zone: 1, price: 20 },
		{ id: 'ramat-a', name: "רמת בית שמש א'", zone: 1, price: 20 },
		{ id: 'ramat-b', name: "רמת בית שמש ב'", zone: 1, price: 20 },
		{ id: 'ramat-c', name: "רמת בית שמש ג'", zone: 1, price: 20 },
		{ id: 'ramat-d', name: "רמת בית שמש ד'", zone: 1, price: 20 },
		{ id: 'ramat-e', name: "רמת בית שמש ה' (נווה שמיר)", zone: 1, price: 20 },

		// אזור 2 - ₪40
		{ id: 'merkaz', name: 'מרכז העיר בית שמש', zone: 2, price: 40 },
		{ id: 'givat-saret', name: 'גבעת שרת', zone: 2, price: 40 },
		{ id: 'tzora', name: 'צרעה', zone: 2, price: 40 },
		{ id: 'zanoach', name: 'זנוח', zone: 2, price: 40 },
		{ id: 'neve-michael', name: 'נווה מיכאל', zone: 2, price: 40 },
		{ id: 'machseya', name: 'מחסיה', zone: 2, price: 40 },
		{ id: 'yishi', name: 'ישעי', zone: 2, price: 40 },
		{ id: 'zecharya', name: 'זכריה', zone: 2, price: 40 },
		{ id: 'netiv-halamed', name: 'נתיב הל"ה', zone: 2, price: 40 },

		// אזור 3 - ייקבע בטלפון
		{ id: 'tzur-hadasa', name: 'צור הדסה', zone: 3, price: null, requiresCall: true },
		{ id: 'kfar-uriya', name: 'כפר אוריה', zone: 3, price: null, requiresCall: true },
		{ id: 'beit-meir', name: 'בית מאיר', zone: 3, price: null, requiresCall: true },
		{ id: 'jerusalem', name: 'ירושלים', zone: 3, price: null, requiresCall: true },
		{ id: 'modiin', name: 'מודיעין', zone: 3, price: null, requiresCall: true },
		{ id: 'other', name: 'אחר...', zone: 3, price: null, requiresCall: true },
	]);

	const deliveryZones = ref([
		{ id: 1, name: 'אזור 1 - בית שמש', description: 'שכונות בית שמש', price: 20, icon: '🏠' },
		{ id: 2, name: 'אזור 2 - סביבה קרובה', description: 'ישובים סמוכים', price: 40, icon: '🚗' },
		{ id: 3, name: 'אזור 3 - רחוק', description: 'מחיר ייקבע בטלפון', price: null, icon: '📞', requiresCall: true },
	]);

	// ===== PAYMENT OPTIONS =====
	const paymentMethod = ref('');

	const paymentMethods = ref([
		{
			id: 'bit',
			name: 'Bit',
			description: 'תשלום מהיר ומאובטח',
			icon: '💙',
			phone: '0524441093',
			link: 'https://www.bitpay.co.il/app/me/0524441093',
			instructions: 'לחצו על הכפתור או שלחו תשלום למספר 0524441093',
		},
		{
			id: 'paybox',
			name: 'PayBox',
			description: 'תשלום דרך פייבוקס',
			icon: '📦',
			phone: '0528460331',
			link: 'https://payboxapp.page.link/iChLPfvwFW4rGqDK6',
			instructions: 'לחצו על הכפתור או שלחו תשלום למספר 0528460331',
		},
		{
			id: 'cash',
			name: 'מזומן',
			description: 'תשלום במעמד המסירה',
			icon: '💵',
			instructions: 'התשלום יתבצע בעת קבלת ההזמנה',
		},
	]);

	// ===== GETTERS =====
	const cartTotal = computed(() => {
		return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
	});

	const cartItemCount = computed(() => {
		return cart.value.reduce((sum, item) => sum + item.quantity, 0);
	});

	const selectedLocationData = computed(() => {
		return locations.value.find(loc => loc.id === selectedLocation.value);
	});

	const deliveryPrice = computed(() => {
		if (deliveryOption.value === 'pickup') return 0;
		if (!selectedLocationData.value) return 0;
		return selectedLocationData.value.price || 0;
	});

	const deliveryRequiresCall = computed(() => {
		if (deliveryOption.value === 'pickup') return false;
		if (!selectedLocationData.value) return false;
		return selectedLocationData.value.requiresCall || false;
	});

	const selectedDeliveryZone = computed(() => {
		if (!selectedLocationData.value) return null;
		return deliveryZones.value.find(z => z.id === selectedLocationData.value.zone);
	});

	const orderTotal = computed(() => {
		return cartTotal.value + deliveryPrice.value;
	});

	// חישוב הנחת קופון
	const couponDiscount = computed(() => {
		if (!appliedCoupon.value) return 0;

		const coupon = appliedCoupon.value;

		if (coupon.type === 'percent') {
			return Math.round(cartTotal.value * (coupon.value / 100));
		} else if (coupon.type === 'fixed') {
			return coupon.value;
		} else if (coupon.type === 'freeDelivery') {
			return deliveryPrice.value;
		}

		return 0;
	});

	// סה"כ סופי אחרי הנחה
	const finalTotal = computed(() => {
		let total = orderTotal.value - couponDiscount.value;
		return Math.max(total, 0); // לא פחות מ-0
	});

	const selectedPaymentMethod = computed(() => {
		return paymentMethods.value.find(m => m.id === paymentMethod.value);
	});

	const isCartEmpty = computed(() => cart.value.length === 0);

	const canProceedToCheckout = computed(() => !isCartEmpty.value);

	const canProceedToPayment = computed(() => {
		const hasCustomerInfo = customerInfo.value.name && customerInfo.value.phone;
		const hasDeliveryChoice =
			deliveryOption.value === 'pickup' || (deliveryOption.value === 'delivery' && selectedLocation.value);
		const hasAddress = deliveryOption.value === 'pickup' || customerInfo.value.address;
		return hasCustomerInfo && hasDeliveryChoice && hasAddress;
	});

	const canCompleteOrder = computed(() => {
		return canProceedToPayment.value && paymentMethod.value;
	});

	const zone1Locations = computed(() => locations.value.filter(loc => loc.zone === 1));
	const zone2Locations = computed(() => locations.value.filter(loc => loc.zone === 2));
	const zone3Locations = computed(() => locations.value.filter(loc => loc.zone === 3));

	// ===== ACTIONS =====
	function addToCart(product, quantity = 1) {
		const toastStore = useToastStore();

		const existingItem = cart.value.find(item => item.id === product.id);

		if (existingItem) {
			existingItem.quantity += quantity;
			toastStore.success(`הכמות עודכנה: ${product.name} (${existingItem.quantity})`);
		} else {
			cart.value.push({
				id: product.id,
				name: product.name,
				price: product.price,
				image: product.image,
				quantity,
			});
			toastStore.success(`${product.name} נוסף לסל 🛒`);
		}
	}

	function removeFromCart(productId) {
		const toastStore = useToastStore();
		const item = cart.value.find(item => item.id === productId);
		cart.value = cart.value.filter(item => item.id !== productId);
		if (item) {
			toastStore.info(`${item.name} הוסר מהסל`);
		}
	}

	function updateQuantity(productId, quantity) {
		const item = cart.value.find(item => item.id === productId);
		if (item) {
			if (quantity <= 0) {
				removeFromCart(productId);
			} else {
				item.quantity = quantity;
			}
		}
	}

	function clearCart() {
		const toastStore = useToastStore();
		cart.value = [];
		localStorage.removeItem('margalitot_cart');
		toastStore.info('הסל רוקן');
	}

	function setCustomerInfo(info) {
		customerInfo.value = { ...customerInfo.value, ...info };
	}

	function setDeliveryOption(option) {
		deliveryOption.value = option;
		if (option === 'pickup') {
			selectedLocation.value = '';
		}
	}

	function setSelectedLocation(locationId) {
		selectedLocation.value = locationId;
		const location = locations.value.find(loc => loc.id === locationId);
		if (location) {
			customerInfo.value.city = location.name;
		}
	}

	function setPaymentMethod(method) {
		paymentMethod.value = method;
	}

	function setStep(step) {
		currentStep.value = step;
	}

	function nextStep() {
		if (currentStep.value < 5) {
			currentStep.value++;
		}
	}

	function prevStep() {
		if (currentStep.value > 1) {
			currentStep.value--;
		}
	}

	function generateOrderId() {
		const timestamp = Date.now().toString(36);
		const random = Math.random().toString(36).substr(2, 4);
		return `MRG-${timestamp}-${random}`.toUpperCase();
	}

	function generateWhatsAppMessage() {
		const orderId = lastOrder.value?.orderId || generateOrderId();
		let message = `🍓 *הזמנה חדשה ממרגליתות*\n`;
		message += `📋 מספר הזמנה: ${orderId}\n\n`;

		message += `👤 *פרטי לקוח:*\n`;
		message += `שם: ${customerInfo.value.name}\n`;
		message += `טלפון: ${customerInfo.value.phone}\n`;
		if (customerInfo.value.email) {
			message += `אימייל: ${customerInfo.value.email}\n`;
		}
		message += `\n`;

		message += `📦 *אופן קבלה:*\n`;
		if (deliveryOption.value === 'pickup') {
			message += `איסוף עצמי משכונת המשקפיים, בית שמש\n`;
		} else {
			const location = selectedLocationData.value;
			message += `משלוח ל: ${customerInfo.value.address}\n`;
			message += `ישוב: ${location?.name || customerInfo.value.city}\n`;
			if (location) {
				if (location.price) {
					message += `מחיר משלוח: ₪${location.price}\n`;
				} else {
					message += `מחיר משלוח: ייקבע בטלפון\n`;
				}
			}
		}
		message += `\n`;

		if (orderDate.value || orderTime.value) {
			message += `📅 *מועד מבוקש:*\n`;
			if (orderDate.value) message += `תאריך: ${orderDate.value}\n`;
			if (orderTime.value) message += `שעה: ${orderTime.value}\n`;
			message += `\n`;
		}

		message += `🛒 *פריטים:*\n`;
		cart.value.forEach(item => {
			message += `• ${item.name} x${item.quantity} - ₪${item.price * item.quantity}\n`;
		});
		message += `\n`;

		message += `💰 *סיכום:*\n`;
		message += `סה"כ מוצרים: ₪${cartTotal.value}\n`;
		if (deliveryOption.value === 'delivery' && deliveryPrice.value > 0) {
			message += `משלוח: ₪${deliveryPrice.value}\n`;
		}
		if (deliveryRequiresCall.value) {
			message += `משלוח: ייקבע בטלפון\n`;
		}
		message += `*סה"כ לתשלום: ₪${orderTotal.value}${deliveryRequiresCall.value ? ' + משלוח' : ''}*\n\n`;

		message += `💳 *אמצעי תשלום:* ${selectedPaymentMethod.value?.name || ''}\n`;

		if (specialRequests.value) {
			message += `\n📝 *הערות:*\n${specialRequests.value}\n`;
		}

		return { message, orderId };
	}

	function getWhatsAppLink() {
		const { message } = generateWhatsAppMessage();
		const encodedMessage = encodeURIComponent(message);
		return `https://wa.me/972528460331?text=${encodedMessage}`;
	}

	async function submitOrder() {
		const toastStore = useToastStore();
		isLoading.value = true;

		try {
			const orderId = generateOrderId();
			const orderData = {
				orderId,
				items: [...cart.value],
				customer: { ...customerInfo.value },
				delivery: {
					option: deliveryOption.value,
					location: selectedLocationData.value ? { ...selectedLocationData.value } : null,
					price: hasFreeDelivery.value ? 0 : deliveryPrice.value,
					requiresCall: deliveryRequiresCall.value && !hasFreeDelivery.value,
				},
				payment: {
					method: paymentMethod.value,
				},
				coupon: appliedCoupon.value
					? {
							code: appliedCoupon.value.code,
							discount: couponDiscount.value,
					  }
					: null,
				date: orderDate.value,
				time: orderTime.value,
				specialRequests: specialRequests.value,
				subtotal: cartTotal.value,
				deliveryFee: hasFreeDelivery.value ? 0 : deliveryPrice.value,
				discount: couponDiscount.value,
				total: finalTotal.value,
			};

			// שמירה ב-Firebase
			const savedOrder = await createOrder(orderData);

			// שמירת שימוש בקופון
			if (appliedCoupon.value) {
				await saveCouponUsage(appliedCoupon.value.code, customerInfo.value.phone, savedOrder.id);
			}

			// שליחת אימייל
			sendOrderEmail(orderData).catch(err => {
				console.error('Email notification failed:', err);
			});

			// שמירה מקומית
			lastOrder.value = savedOrder;
			orderHistory.value.unshift(savedOrder);
			saveOrderToLocalStorage(savedOrder);

			currentStep.value = 5;
			toastStore.success('ההזמנה נשלחה בהצלחה! 🎉', 5000);

			return savedOrder;
		} catch (error) {
			console.error('Order submission failed:', error);
			toastStore.error('שגיאה בשליחת ההזמנה, נסו שוב');
			throw error;
		} finally {
			isLoading.value = false;
		}
	}

	function saveOrderToLocalStorage(order) {
		try {
			const phone = order.customer.phone;
			const storageKey = `orders_${phone}`;
			const existingOrders = JSON.parse(localStorage.getItem(storageKey) || '[]');
			existingOrders.unshift({
				id: order.id,
				orderId: order.orderId,
				total: order.total,
				status: order.status,
				createdAt: new Date().toISOString(),
			});
			// שמור רק 20 הזמנות אחרונות
			localStorage.setItem(storageKey, JSON.stringify(existingOrders.slice(0, 20)));
		} catch (error) {
			console.error('Failed to save order to localStorage:', error);
		}
	}

	function getOrdersFromLocalStorage(phone) {
		try {
			const storageKey = `orders_${phone}`;
			return JSON.parse(localStorage.getItem(storageKey) || '[]');
		} catch (error) {
			console.error('Failed to get orders from localStorage:', error);
			return [];
		}
	}

	function resetOrder() {
		clearCart();
		customerInfo.value = { name: '', phone: '', email: '', address: '', city: '' };
		deliveryOption.value = 'pickup';
		selectedLocation.value = '';
		paymentMethod.value = '';
		orderDate.value = '';
		orderTime.value = '';
		specialRequests.value = '';
		currentStep.value = 1;
		lastOrder.value = null;
	}
	// שמירה אוטומטית של העגלה בכל שינוי
	watch(
		cart,
		newCart => {
			saveCartToStorage(newCart);
		},
		{ deep: true },
	);
	// בדיקה והחלת קופון
	async function applyCoupon(code) {
		const toastStore = useToastStore();
		couponError.value = '';
		couponSuccess.value = '';

		if (!code || code.trim() === '') {
			couponError.value = 'נא להזין קוד קופון';
			return false;
		}

		const coupon = availableCoupons.value.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);

		if (!coupon) {
			couponError.value = 'קוד הקופון לא תקין';
			return false;
		}

		if (cartTotal.value < coupon.minOrder) {
			couponError.value = `הקופון תקף להזמנה מעל ₪${coupon.minOrder}`;
			return false;
		}

		if (!customerInfo.value.phone) {
			couponError.value = 'נא להזין מספר טלפון קודם';
			return false;
		}

		// בדיקה ב-Firebase - רק לפי טלפון
		const usage = await checkCouponUsage(code, customerInfo.value.phone);

		if (usage.used) {
			couponError.value = 'הקופון כבר נוצל עם מספר טלפון זה';
			return false;
		}

		appliedCoupon.value = coupon;
		couponSuccess.value = coupon.description;
		toastStore.success(`🎫 ${coupon.description}`);
		return true;
	}

	// הסרת קופון
	function removeCoupon() {
		appliedCoupon.value = null;
		couponError.value = '';
		couponSuccess.value = '';
	}

	// בדיקה אם קופון משלוח חינם
	const hasFreeDelivery = computed(() => {
		return appliedCoupon.value?.type === 'freeDelivery';
	});
	return {
		// State
		cart,
		customerInfo,
		orderDate,
		orderTime,
		specialRequests,
		orderHistory,
		isLoading,
		currentStep,
		lastOrder,
		deliveryOption,
		selectedLocation,
		locations,
		deliveryZones,
		paymentMethod,
		paymentMethods,
		// Getters
		cartTotal,
		cartItemCount,
		selectedLocationData,
		deliveryPrice,
		deliveryRequiresCall,
		selectedDeliveryZone,
		orderTotal,
		selectedPaymentMethod,
		isCartEmpty,
		canProceedToCheckout,
		canProceedToPayment,
		canCompleteOrder,
		zone1Locations,
		zone2Locations,
		zone3Locations,
		// Actions
		addToCart,
		removeFromCart,
		updateQuantity,
		clearCart,
		setCustomerInfo,
		setDeliveryOption,
		setSelectedLocation,
		setPaymentMethod,
		setStep,
		nextStep,
		prevStep,
		generateWhatsAppMessage,
		getWhatsAppLink,
		submitOrder,
		resetOrder,
		getOrdersFromLocalStorage,
		// Coupons
		appliedCoupon,
		couponError,
		couponSuccess,
		couponDiscount,
		finalTotal,
		hasFreeDelivery,
		applyCoupon,
		removeCoupon,
	};
});

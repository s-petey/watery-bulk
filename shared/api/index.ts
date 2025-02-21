import { simulateApiDelay } from "./helpers";

export const funky = "give me that funky beat";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface ProductOrder {
  orderId: number;
  productName: string;
  quantity: number;
  userId: number;
}

export interface UserUi {
  id: number;
  userId: number;
  name: string;
}

export interface UiContent {
  id: number;
  uiId: number;
  content: string;
}

const USERS: User[] = [
  { id: 1, name: "Willow", email: "watery_willow@example.com" },
  { id: 2, name: "Bob", email: "bulky_bob@example.com" },
];

const PRODUCT_ORDERS: ProductOrder[] = [
  { orderId: 101, productName: "Widget", quantity: 10, userId: 1 },
  { orderId: 102, productName: "Gadget", quantity: 5, userId: 2 },
  { orderId: 103, productName: "Doodad", quantity: 7, userId: 1 },
  { orderId: 104, productName: "Thingamajig", quantity: 3, userId: 2 },
  { orderId: 105, productName: "Contraption", quantity: 8, userId: 1 },
  { orderId: 106, productName: "Gizmo", quantity: 2, userId: 2 },
  { orderId: 107, productName: "Doohickey", quantity: 6, userId: 1 },
  { orderId: 108, productName: "Whatsit", quantity: 4, userId: 2 },
  { orderId: 109, productName: "Thingy", quantity: 9, userId: 1 },
  { orderId: 110, productName: "Whatchamacallit", quantity: 1, userId: 2 },
  { orderId: 111, productName: "Gadget", quantity: 5, userId: 1 },
  { orderId: 112, productName: "Widget", quantity: 10, userId: 2 },
];

export const getUserById = async (userId: number): Promise<User> => {
  await simulateApiDelay();
  const user = USERS.find((user) => user.id === userId);

  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  return user;
};

export const getOrdersByUserId = async (
  userId: number
): Promise<ProductOrder[]> => {
  await simulateApiDelay();
  // Simulate an API call to load product orders
  return PRODUCT_ORDERS.filter((order) => order.userId === userId);
};

export async function getUserUis(userId: number): Promise<UserUi[]> {
  await simulateApiDelay();

  const randomBetween3And6 = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
  const uiGenerator = generateFakeUserUi(userId);
  const uis: UserUi[] = [];
  for (let i = 0; i < randomBetween3And6; i++) {
    const v = uiGenerator.next().value;
    if (v) {
      uis.push(v);
    }
  }

  return uis;
}

export async function getUiContentById(uiId: number): Promise<UiContent> {
  await simulateApiDelay();
  const content = {
    id: Math.floor(Math.random() * 1000),
    uiId,
    content: `Random Content ${uiId}`,
  };

  return content;
}

function* generateFakeUserUi(userId: number): Generator<UserUi, void, unknown> {
  let id = 1;
  while (true) {
    yield {
      id: id,
      userId,
      name: `Random Page ${id}`,
    };
    id++;
  }
}

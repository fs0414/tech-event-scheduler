import Form from "next/form";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default function Home() {
  // Server Action
  async function createUser(formData: FormData) {
    "use server";

    const name = formData.get("name");
    const email = formData.get("email");

    try {
      // ユーザー作成処理
      await prisma.user.create({
        data: {
          name: name as string,
          email: email as string,
        },
      });

      console.log("ユーザー作成に成功しました");
    } catch (error) {
      console.error("ユーザー作成に失敗しました, " + error);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <Form action={createUser} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            名前
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          ユーザーを作成
        </button>
      </Form>
    </div>
  );
}

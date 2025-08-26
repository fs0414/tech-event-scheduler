import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('シードデータを作成中...')

  // Users データ作成
  console.log('ユーザーデータを作成中...')
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: 'user-1',
        supabaseId: 'supabase-user-1',
        email: 'tanaka.taro@gmail.com',
        name: '田中太郎',
        avatarUrl: null,
      },
    }),
    prisma.user.create({
      data: {
        id: 'user-2',
        supabaseId: 'supabase-user-2',
        email: 'suzuki.hanako@gmail.com',
        name: '鈴木花子',
        avatarUrl: null,
      },
    }),
    prisma.user.create({
      data: {
        id: 'user-3',
        supabaseId: 'supabase-user-3',
        email: 'sato.kenichi@gmail.com',
        name: '佐藤健一',
        avatarUrl: null,
      },
    }),
    prisma.user.create({
      data: {
        id: 'user-4',
        supabaseId: 'supabase-user-4',
        email: 'takahashi.misaki@gmail.com',
        name: '高橋美咲',
        avatarUrl: null,
      },
    }),
    prisma.user.create({
      data: {
        id: 'user-5',
        supabaseId: 'supabase-user-5',
        email: 'ito.takashi@gmail.com',
        name: '伊藤隆',
        avatarUrl: null,
      },
    }),
  ])

  // Events データ作成
  console.log('イベントデータを作成中...')
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'React Tokyo Conference 2024',
        eventUrl: 'https://react-tokyo.com/2024',
        attendance: 0,
      },
    }),
    prisma.event.create({
      data: {
        title: 'JSConf JP 2024',
        eventUrl: 'https://jsconf.jp/2024',
        attendance: 0,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Vue Fes Japan 2024',
        eventUrl: 'https://vuefes.jp/2024',
        attendance: 0,
      },
    }),
    prisma.event.create({
      data: {
        title: 'TypeScript Meetup Tokyo #15',
        eventUrl: 'https://typescript-meetup.jp/events/15',
        attendance: 0,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Frontend Conference Fukuoka 2024',
        eventUrl: 'https://frontend-conf.fukuoka.jp/2024',
        attendance: 0,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Node.js Japan User Group Meetup',
        eventUrl: 'https://nodejs.jp/meetup/2024-01',
        attendance: 0,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Web Performance Summit 2024',
        eventUrl: 'https://webperf-summit.jp/2024',
        attendance: 0,
      },
    }),
    prisma.event.create({
      data: {
        title: 'GraphQL Tokyo Conference',
        eventUrl: 'https://graphql-tokyo.com/2024',
        attendance: 0,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Serverless Days Tokyo 2024',
        eventUrl: 'https://serverlessdays.tokyo/2024',
        attendance: 0,
      },
    }),
    prisma.event.create({
      data: {
        title: 'DevOps Days Tokyo 2024',
        eventUrl: 'https://devopsdays.tokyo/2024',
        attendance: 0,
      },
    }),
  ])

  // Owners データ作成（参加者情報）
  console.log('参加者データを作成中...')
  await Promise.all([
    prisma.owner.create({
      data: {
        userId: 'user-1',
        eventId: 1,
        role: 20,
      },
    }),
    prisma.owner.create({
      data: {
        userId: 'user-1',
        eventId: 3,
        role: 10,
      },
    }),
    prisma.owner.create({
      data: {
        userId: 'user-1',
        eventId: 5,
        role: 20,
      },
    }),
    prisma.owner.create({
      data: {
        userId: 'user-2',
        eventId: 2,
        role: 20,
      },
    }),
    prisma.owner.create({
      data: {
        userId: 'user-2',
        eventId: 4,
        role: 20,
      },
    }),
    prisma.owner.create({
      data: {
        userId: 'user-2',
        eventId: 7,
        role: 20,
      },
    }),
    prisma.owner.create({
      data: {
        userId: 'user-3',
        eventId: 1,
        role: 20,
      },
    }),
    prisma.owner.create({
      data: {
        userId: 'user-3',
        eventId: 6,
        role: 20,
      },
    }),
    prisma.owner.create({
      data: {
        userId: 'user-3',
        eventId: 8,
        role: 20,
      },
    }),
    prisma.owner.create({
      data: {
        userId: 'user-4',
        eventId: 3,
        role: 20,
      },
    }),
    prisma.owner.create({
      data: {
        userId: 'user-4',
        eventId: 9,
        role: 20,
      },
    }),
    prisma.owner.create({
      data: {
        userId: 'user-4',
        eventId: 10,
        role: 20,
      },
    }),
    prisma.owner.create({
      data: {
        userId: 'user-5',
        eventId: 2,
        role: 20,
      },
    }),
    prisma.owner.create({
      data: {
        userId: 'user-5',
        eventId: 5,
        role: 20,
      },
    }),
    prisma.owner.create({
      data: {
        userId: 'user-5',
        eventId: 10,
        role: 20,
      },
    }),
  ])

  // Articles データ作成
  console.log('記事データを作成中...')
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: 'React Hooksの基礎から応用まで',
        description: 'React Hooksについての詳しい解説記事。useStateからuseEffectまで幅広くカバーします。',
        url: 'https://example.com/react-hooks',
      },
    }),
    prisma.article.create({
      data: {
        title: 'モダンJavaScriptの最新機能',
        description: 'ES2024の新機能や最新のJavaScript開発手法について解説します。',
        url: 'https://example.com/modern-javascript',
      },
    }),
    prisma.article.create({
      data: {
        title: 'Vue.js 3 Composition APIガイド',
        description: 'Vue.js 3のComposition APIを使った効率的な開発方法を紹介します。',
        url: 'https://example.com/vue-composition-api',
      },
    }),
    prisma.article.create({
      data: {
        title: 'TypeScriptで型安全なアプリ開発',
        description: 'TypeScriptの型システムを活用した安全なアプリケーション開発手法について',
        url: 'https://example.com/typescript-safety',
      },
    }),
    prisma.article.create({
      data: {
        title: 'Webパフォーマンス最適化の実践',
        description: 'Core Web Vitalsを改善するための実践的なテクニックを紹介します。',
        url: 'https://example.com/web-performance',
      },
    }),
  ])

  // Speakers データ作成
  console.log('スピーカーデータを作成中...')
  await Promise.all([
    prisma.speaker.create({
      data: {
        userId: 'user-1',
        eventId: 1,
        articleId: 1,
        role: 'speaker',
      },
    }),
    prisma.speaker.create({
      data: {
        userId: 'user-2',
        eventId: 2,
        articleId: 2,
        role: 'speaker',
      },
    }),
    prisma.speaker.create({
      data: {
        userId: 'user-3',
        eventId: 3,
        articleId: 3,
        role: 'keynote',
      },
    }),
    prisma.speaker.create({
      data: {
        userId: 'user-4',
        eventId: 4,
        articleId: 4,
        role: 'speaker',
      },
    }),
    prisma.speaker.create({
      data: {
        userId: 'user-5',
        eventId: 7,
        articleId: 5,
        role: 'speaker',
      },
    }),
    prisma.speaker.create({
      data: {
        userId: 'user-1',
        eventId: 5,
        articleId: null,
        role: 'moderator',
      },
    }),
    prisma.speaker.create({
      data: {
        userId: 'user-3',
        eventId: 8,
        articleId: null,
        role: 'moderator',
      },
    }),
  ])

  // Timer データ作成
  console.log('タイマーデータを作成中...')
  await Promise.all([
    // React Tokyo Conference 2024のタイムスケジュール
    prisma.timer.create({
      data: {
        eventId: 1,
        durationMinutes: 30,
        sequence: 1,
      },
    }),
    prisma.timer.create({
      data: {
        eventId: 1,
        durationMinutes: 45,
        sequence: 2,
      },
    }),
    prisma.timer.create({
      data: {
        eventId: 1,
        durationMinutes: 15,
        sequence: 3,
      },
    }),
    // JSConf JP 2024のタイムスケジュール
    prisma.timer.create({
      data: {
        eventId: 2,
        durationMinutes: 20,
        sequence: 1,
      },
    }),
    prisma.timer.create({
      data: {
        eventId: 2,
        durationMinutes: 60,
        sequence: 2,
      },
    }),
    // Vue Fes Japan 2024のタイムスケジュール
    prisma.timer.create({
      data: {
        eventId: 3,
        durationMinutes: 40,
        sequence: 1,
      },
    }),
    prisma.timer.create({
      data: {
        eventId: 3,
        durationMinutes: 30,
        sequence: 2,
      },
    }),
    // TypeScript Meetup Tokyo #15のタイムスケジュール
    prisma.timer.create({
      data: {
        eventId: 4,
        durationMinutes: 25,
        sequence: 1,
      },
    }),
    // Web Performance Summit 2024のタイムスケジュール
    prisma.timer.create({
      data: {
        eventId: 7,
        durationMinutes: 50,
        sequence: 1,
      },
    }),
    prisma.timer.create({
      data: {
        eventId: 7,
        durationMinutes: 10,
        sequence: 2,
      },
    }),
  ])

  console.log('シードデータの作成が完了しました！')
  console.log(`作成されたデータ:`)
  console.log(`- ユーザー: ${users.length}件`)
  console.log(`- イベント: ${events.length}件`)
  console.log(`- 参加者情報: 15件`)
  console.log(`- 記事: ${articles.length}件`)
  console.log(`- スピーカー情報: 7件`)
  console.log(`- タイマー情報: 10件`)
}

main()
  .catch((e) => {
    console.error('シードデータの作成中にエラーが発生しました:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
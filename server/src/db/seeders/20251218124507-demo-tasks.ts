import { QueryInterface, Sequelize } from 'sequelize';

interface TaskSeedData {
  title: string;
  status: boolean;
  user_id: number;
  createdAt: Date;
  updatedAt: Date;
}

const seeder = {
  async up(queryInterface: QueryInterface, sequelize: Sequelize): Promise<void> {
    try {
      const tasks: TaskSeedData[] = [
        {
          title: 'Закончить проект',
          status: false,
          user_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Сделать домашнее задание',
          status: true,
          user_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Купить продукты',
          status: false,
          user_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Записаться к врачу',
          status: false,
          user_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Прочитать книгу',
          status: true,
          user_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Подготовить презентацию',
          status: false,
          user_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Починить кран',
          status: false,
          user_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Ответить на письма',
          status: true,
          user_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await queryInterface.bulkInsert('Tasks', tasks, {});
    } catch (error) {
      console.error('❌ Error seeding tasks:', error);
      throw error;
    }
  },

  async down(queryInterface: QueryInterface, sequelize: Sequelize): Promise<void> {
    try {
      await queryInterface.bulkDelete('Tasks', {}, {});
    } catch (error) {
      console.error('❌ Error removing task seed data:', error);
      throw error;
    }
  },
};

export default seeder;

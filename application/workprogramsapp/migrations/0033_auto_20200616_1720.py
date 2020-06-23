# Generated by Django 2.2.6 on 2020-06-16 17:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('workprogramsapp', '0032_auto_20200616_1528'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workprogramchangeindisciplineblockmodule',
            name='discipline_block_module',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='change_blocks_of_work_programs_in_modules', to='workprogramsapp.DisciplineBlockModule', verbose_name='Модуль в блоке'),
        ),
    ]

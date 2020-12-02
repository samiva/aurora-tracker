from crontab import CronTab

my_cron = CronTab(user='phong')
job = my_cron.new(command='python3 /home/ubuntu/aurora-tracker/ControlServer/app/routes/updateMag.py')
job.minute.every(1)
 
my_cron.write()

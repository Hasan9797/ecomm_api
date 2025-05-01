import { exec } from 'child_process';

const dbSeed = async (req, res) => {
    exec('npm run db:seed', (error, stdout, stderr) => {
        if (error) {
            console.error(`Xatolik: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            console.error(`Xatolik STDERR: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }

        console.log(`Natija: ${stdout}`);
        res.json({ message: 'Seed bajarildi', output: stdout });
    });
}

const dbReset = async (req, res) => {
    exec('npm run db:reset', (error, stdout, stderr) => {
        if (error) {
            console.error(`Xatolik: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            console.error(`Xatolik STDERR: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }

        console.log(`Natija: ${stdout}`);
        res.json({ message: 'Reset bajarildi', output: stdout });
    });
}

export default {
    dbSeed,
    dbReset
}
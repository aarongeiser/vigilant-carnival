FROM hypriot/rpi-node:6.9.4

# Open Port 80
EXPOSE 80

# Run Node.js
CMD ["node", "app.js"]
#!/bin/bash

# Проверяем, что файлы существуют
for i in {149..1}; do
    old_name="image_${i}.webp"
    new_name="image_$((i+28)).webp"
    
    # Проверяем, существует ли исходный файл
    if [ -f "$old_name" ]; then
        # Переименовываем файл
        mv -i "$old_name" "$new_name"
        echo "Переименовал $old_name в $new_name"
    else
        echo "Файл $old_name не найден"
    fi
done

echo "Готово! Теперь можно добавить новые файлы image_1.webp - image_28.webp"

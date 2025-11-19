import pygame
import sys
from flappy import train_ai  # dùng lại train_ai bạn đã viết


class TrainScene:
    def __init__(self, screen):
        self.screen = screen
        self.font = pygame.font.Font(None, 50)

    def run(self):
        # Màn hình thông báo
        self.screen.fill((10, 10, 20))
        txt = self.font.render("Đang train AI...", True, (255, 255, 0))
        self.screen.blit(txt, (120, 260))
        pygame.display.update()

        # Gọi train (sẽ tự mở loop, vẽ, ... như bạn code)
        train_ai()

        # Sau khi train xong → về menu
        return "menu", {"player": None}
